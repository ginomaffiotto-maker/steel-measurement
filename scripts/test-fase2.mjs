// Prueba de punta a punta de la Fase 2 (login real + RLS + trigger de
// tenant_id). No importa storage.js directamente (CRA no lo deja correr
// como script de Node suelto sin loader), así que repite acá las mismas
// llamadas que loadDBClientes/saveDBCliente/loadDBPresupuestosSM hacen —
// si algo falla acá, el problema está en la base, no en el wrapper de la app.
//
// Uso (en tu propia terminal, la contraseña NUNCA se comparte por chat):
//   $env:SM_TEST_EMAIL = "ginomaffiotto@gmail.com"
//   $env:SM_TEST_PASSWORD = "tu-password-real"
//   node scripts/test-fase2.mjs

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lnblgecgskjyulbqocet.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYmxnZWNnc2tqeXVsYnFvY2V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0MTE0MTgsImV4cCI6MjEwMjk4NzQxOH0.Oezp-ndjR1nwwHVHJqmd8KNCsV01uFwjwpuSt9lWPEo";

const email = process.env.SM_TEST_EMAIL;
const password = process.env.SM_TEST_PASSWORD;

if (!email || !password) {
  console.error("Faltan SM_TEST_EMAIL / SM_TEST_PASSWORD como variables de entorno.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const step = async (nombre, fn) => {
  try {
    const r = await fn();
    console.log(`✅ ${nombre}`, r ?? "");
    return r;
  } catch (e) {
    console.error(`❌ ${nombre}:`, e.message || e);
    process.exit(1);
  }
};

console.log(`Probando contra ${SUPABASE_URL} como ${email}...\n`);

await step("Login (signInWithPassword)", async () => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.session) throw new Error("sin sesión devuelta");
  return `sesión OK, user_id=${data.user.id}`;
});

await step("SELECT profiles (propio)", async () => {
  const { data, error } = await supabase.from("profiles").select("*").single();
  if (error) throw error;
  return `tenant_id=${data.tenant_id}, rol=${data.rol}`;
});

await step("SELECT clientes (vacío o con datos, no debe fallar)", async () => {
  const { data, error } = await supabase.from("clientes").select("*");
  if (error) throw error;
  return `${data.length} cliente(s) existentes`;
});

const nuevoCliente = await step("INSERT cliente de prueba (sin pasar tenant_id — lo pone el trigger)", async () => {
  const { data, error } = await supabase
    .from("clientes")
    .insert({ nombre: "Cliente Prueba Fase 2", empresa: "Test SA" })
    .select()
    .single();
  if (error) throw error;
  if (!data.tenant_id) throw new Error("el trigger no completó tenant_id");
  return data; // objeto completo, no un string — lo necesitamos para la limpieza
});

await step("SELECT presupuestos_sm (vacío o con datos, no debe fallar)", async () => {
  const { data, error } = await supabase.from("presupuestos_sm").select("*");
  if (error) throw error;
  return `${data.length} presupuesto(s) existentes`;
});

await step("Limpieza: borrar clientes de prueba", async () => {
  // Por nombre en vez de por id: así también se lleva puesto cualquier
  // sobrante de una corrida anterior que haya fallado antes de limpiar.
  const { error } = await supabase.from("clientes").delete().eq("nombre", nuevoCliente.nombre);
  if (error) throw error;
});

console.log("\n🎉 Fase 2 verificada de punta a punta: login, RLS y trigger de tenant_id funcionan.");
process.exit(0);
