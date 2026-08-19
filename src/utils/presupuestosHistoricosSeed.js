// Presupuestos históricos APROXIMADOS, generados desde historialSeed.js
// (misma fuente: "Datos de fabricación.xlsx", 239 trabajos 2017-2024).
//
// IMPORTANTE — son una reconstrucción, no el cálculo real: el dato fuente
// sólo tiene % de costo por rubro y totales, no el detalle pieza por pieza.
// Cada presupuesto tiene UN ítem con UNA fila por rubro (Hierros, MO Fab,
// MO Mon, Terceros, Trat. Superficie, Traslados, Pantógrafo) dimensionada
// para que el total coincida con el monto real históricamente facturado —
// no reflejan qué materiales/horas específicas se usaron.
//
// Se cargan sólo si el usuario lo pide explícitamente (botón en Presupuesto),
// nunca automático, y SUMAN a los presupuestos existentes — nunca pisan nada.
// Numerados "H-<N° OT>" para poder identificarlos y filtrarlos aparte.
export const PRESUPUESTOS_HISTORICOS_SEED = [
  {
    "id": "13f6308c-2d6c-4547-b6ad-a479c131a90d",
    "nro": "H-1731",
    "nombre": "Aberturas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "2 manos de fondo antioxido\n30 ventanas - 56 puertas [Desp: 13.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2017-05-08",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7d1f3061-01a7-4e55-86ae-0ee8095a6d00",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b6b055b7-74d9-42b0-9760-7d899c15e8f4",
            "nombre": "Aberturas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 12592,
            "area_pieza_m2": 0,
            "usd_kg": 2.071632613434877,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 12592,
            "subtotal_m2": 0,
            "subtotal_usd": 26086
          }
        ],
        "mat_generales": [
          {
            "id": "8f5db8b2-0e22-45da-8d52-78ffd9257055",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2179.34,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2179.34
          }
        ],
        "mo_fabricacion": [
          {
            "id": "45d57780-029e-4085-9d90-f34badc15080",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1147,
            "usd_hora": 17.04,
            "subtotal_usd": 19544.69
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "05d84562-62fb-462b-ae22-de5de179ddf5",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1759.98,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1759.98
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ede1ce9c-4c0b-43eb-a897-4634f22eb3ee",
    "created_at": "2026-07-31T21:50:37.755241Z",
    "updated_at": "2026-07-31T21:50:37.755241Z"
  },
  {
    "id": "8919a7c1-9888-4063-9060-86d3e9527c2c",
    "nro": "H-1897",
    "nombre": "Aberturas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "2 manos de fondo epoxi [Desp: 11.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2017-10-12",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "fccf1c22-da0d-48f4-8a17-2ffd1da4c735",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a1593ffd-6ef7-4aab-b10a-1c3a4f713426",
            "nombre": "Aberturas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1038,
            "area_pieza_m2": 0,
            "usd_kg": 1.2708265653010828,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1038,
            "subtotal_m2": 0,
            "subtotal_usd": 1319.12
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "1f8a17e3-6455-4b16-ba72-34aee45bc8fd",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 164,
            "usd_hora": 16.83,
            "subtotal_usd": 2759.68
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "7e209099-1810-46a9-97b7-e4e0de55e029",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 517.56,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 517.56
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "f615cb8d-2e1b-418f-a3ce-f936b240189e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.176,
            "kg": 1038,
            "subtotal_usd": 182.64,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "7d113464-b92c-46b2-9a3c-3f760a023731",
    "created_at": "2026-07-31T21:50:37.755241Z",
    "updated_at": "2026-07-31T21:50:37.755241Z"
  },
  {
    "id": "096482ff-7310-4e26-af57-068c15ae72a7",
    "nro": "H-3299",
    "nombre": "Aberturas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "1 mano de fondo antioxido y 2 manos de esmalte sintético [Desp: 211.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-07-28",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8e5a71a3-8b49-4dae-8662-4573678ec692",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b57ce483-bb03-4669-9ea3-c8898d9629ef",
            "nombre": "Aberturas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3749,
            "area_pieza_m2": 0,
            "usd_kg": 2.3277483607347302,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3749,
            "subtotal_m2": 0,
            "subtotal_usd": 8726.73
          }
        ],
        "mat_generales": [
          {
            "id": "4dd9c9b5-53fd-42b8-8f29-a9ed0840e945",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1127.93,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1127.93
          }
        ],
        "mo_fabricacion": [
          {
            "id": "94b5ff79-420e-4dcc-b14d-f2969cf7668d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 464,
            "usd_hora": 18.16,
            "subtotal_usd": 8426.2
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "84c57d24-9c02-462b-8fb1-008652ce591a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 639.1,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 639.1
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "5ba74172-bfc1-4f6d-9950-7fac4f8c8f22",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0101,
            "kg": 3749,
            "subtotal_usd": 38.04,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a4808837-67b3-43ef-b68e-8c4ebaf19c94",
    "created_at": "2026-07-31T21:50:37.756260Z",
    "updated_at": "2026-07-31T21:50:37.756260Z"
  },
  {
    "id": "057a8796-fb31-4558-b1e8-fc86aba689a9",
    "nro": "H--",
    "nombre": "Aberturas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "10 puertas tipo UTE\n2 manos Interseal - 2 manos PU [Desp: 3700.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-11-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "a599ff2e-3bae-4109-a280-08997db7d187",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "00ef95f4-8c47-44e0-bf3f-8fb90712f340",
            "nombre": "Aberturas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1808,
            "area_pieza_m2": 0,
            "usd_kg": 2.1847177439873433,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1808,
            "subtotal_m2": 0,
            "subtotal_usd": 3949.97
          }
        ],
        "mat_generales": [
          {
            "id": "33ab2fc5-956e-4635-9ba9-0bd481d10d90",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1984.15,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1984.15
          }
        ],
        "mo_fabricacion": [
          {
            "id": "b611b902-a2e3-4ae6-a530-2240f2d5914a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 200,
            "usd_hora": 21.64,
            "subtotal_usd": 4328.78
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "bfc59d60-afac-4110-a609-4a480c13cdeb",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 3439.8,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 3439.8
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "2c5263b9-05ef-4eef-a6fc-a169c172a450",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5018,
            "kg": 1808,
            "subtotal_usd": 907.3,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2669cfdb-0776-4db7-b0d7-73c61d13e6bd",
    "created_at": "2026-07-31T21:50:37.756260Z",
    "updated_at": "2026-07-31T21:50:37.756260Z"
  },
  {
    "id": "aa3033f7-f08a-440f-ab2a-d17a6066b0ca",
    "nro": "H--",
    "nombre": "Aberturas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "8 puertas Cómunes\n2 manos Interseal - 2 manos PU [Desp: 3782.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-11-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "3666ddc7-37ea-4048-8e5e-9ef20bdc45a9",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "c3593882-50e0-4b5d-98c9-db354db7dfd2",
            "nombre": "Aberturas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1405,
            "area_pieza_m2": 0,
            "usd_kg": 2.1996103189800453,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1405,
            "subtotal_m2": 0,
            "subtotal_usd": 3090.45
          }
        ],
        "mat_generales": [
          {
            "id": "7be6b3cb-22ce-4411-894b-be054700b3e9",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1840,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1840
          }
        ],
        "mo_fabricacion": [
          {
            "id": "c9adbdd6-a1cf-4962-b866-92bc80c12c16",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 155,
            "usd_hora": 22.31,
            "subtotal_usd": 3458.45
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "db107640-dfc6-4652-91ef-599bfa6cdd6f",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2840.11,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2840.11
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "ab8c4e6f-f263-44e6-b458-9b7c6c8691b4",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5132,
            "kg": 1405,
            "subtotal_usd": 720.98,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "08a26d0e-5f9a-4d8f-b678-57bc0ca5dcc2",
    "created_at": "2026-07-31T21:50:37.756260Z",
    "updated_at": "2026-07-31T21:50:37.756260Z"
  },
  {
    "id": "114627e1-e35e-4e55-ba9e-e91f176f41c6",
    "nro": "H-3263",
    "nombre": "Anclajes - Pernos",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Studs 350x350x19mm - (8) 16mm - 4 IPN80",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-07-02",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "0322f916-62ed-4cae-bedc-3f64714d2271",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3f3b9387-964e-4552-a7fd-f68fafd1dad3",
            "nombre": "Anclajes - Pernos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 84.26,
            "area_pieza_m2": 0,
            "usd_kg": 2.6747652805999595,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 84.26,
            "subtotal_m2": 0,
            "subtotal_usd": 225.38
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "d83042d1-1f2a-4907-947a-6c0ae16fc4a8",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 11,
            "usd_hora": 28.39,
            "subtotal_usd": 312.3
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "1af91764-bfee-457b-960a-b389674444e2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6803,
            "kg": 84.26,
            "subtotal_usd": 57.32,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d1805475-1a9d-4729-b888-af84c81b2fbf",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "f79032a6-5cf6-4e0a-b71b-683d4d86bb98",
    "nro": "H-3312",
    "nombre": "Anclajes - Pernos",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Studs 100x230x12mm - (6) 12mm",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-08-03",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "394ccf97-537b-4d8d-b289-34d107d2aae7",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "2313c9bf-1324-47aa-b010-89aaf1c794a7",
            "nombre": "Anclajes - Pernos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 736.51,
            "area_pieza_m2": 0,
            "usd_kg": 2.373574738003461,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 736.51,
            "subtotal_m2": 0,
            "subtotal_usd": 1748.16
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "0c3c17fe-6811-434b-80ed-553457729ef1",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 35,
            "usd_hora": 58.88,
            "subtotal_usd": 2060.94
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "aaef676f-fb6a-4dbe-8ec7-bd8e47f91ad2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5552,
            "kg": 736.51,
            "subtotal_usd": 408.9,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9c39169d-4042-4a09-af7a-68a3a98c91f3",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "602b0f65-6b85-4f2a-a4b8-a4d1b1aa2029",
    "nro": "H-3386",
    "nombre": "Anclajes - Pernos",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "220 Studs 100x230x12mm - (6) 12mm \n120 Studs 106x289x12mm - (6) 12mm",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-09-29",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "699d6c74-486b-4221-89ad-e27ba5a2e3f7",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3c28dab5-87ae-403c-9ab6-b64a13ff8859",
            "nombre": "Anclajes - Pernos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1622.1,
            "area_pieza_m2": 0,
            "usd_kg": 2.1721762176702586,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1622.1,
            "subtotal_m2": 0,
            "subtotal_usd": 3523.49
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "e7760342-4592-49a2-b529-9f86e4ba323d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 74,
            "usd_hora": 28.4,
            "subtotal_usd": 2101.6
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "ada3980a-0c6f-4aed-8f91-5f8520d8929a",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5209,
            "kg": 1622.1,
            "subtotal_usd": 844.91,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "41ba1589-f702-454c-a0f6-774afba6874f",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "2a61aebc-628b-43cc-8be9-fbebfd093852",
    "nro": "H--",
    "nombre": "Anclajes - Pernos",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "28528ea5-fcf1-4d4f-90ea-74114399a945",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b6a6bf68-f7da-4096-84c5-2824eb1b5361",
            "nombre": "Anclajes - Pernos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 936.5,
            "area_pieza_m2": 0,
            "usd_kg": 2.324415682460442,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 936.5,
            "subtotal_m2": 0,
            "subtotal_usd": 2176.82
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "c3dd055a-5557-45b8-be8e-84d65824a52f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 91,
            "usd_hora": 23.8,
            "subtotal_usd": 2165.94
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "61b9359d-34e6-4895-a7b3-777b8a8bb37d",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1109.47,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1109.47
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "784665b5-eb3e-4a1b-9b68-5d4a59e2cf2e",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 167.13,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 167.13
          }
        ],
        "corte_pantografo": [
          {
            "id": "b8140092-09d1-4fb6-a225-9f757f0a1d9a",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4919,
            "kg": 936.5,
            "subtotal_usd": 460.64,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "0f1f5ebb-340e-4da3-a0bb-65fbd2099165",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "143435e2-5416-4066-9784-50adfca9aad9",
    "nro": "H-3991",
    "nombre": "Anclajes - Pernos",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Pernos J HDG - 0,92kg/un",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "71a9f003-204c-480f-8808-2af71eaac27b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "83893608-84e9-466e-aff4-ead0191fbaa7",
            "nombre": "Anclajes - Pernos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 44,
            "area_pieza_m2": 0,
            "usd_kg": 2.3349991967134103,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 44,
            "subtotal_m2": 0,
            "subtotal_usd": 102.74
          }
        ],
        "mat_generales": [
          {
            "id": "f2bb7b1a-65df-4b80-bf28-3d497aa18d05",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 60.51,
            "obs": "Importado desde histórico",
            "subtotal_usd": 60.51
          }
        ],
        "mo_fabricacion": [
          {
            "id": "01b6c3a9-4eb2-42f1-bf06-ec501930f876",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 19,
            "usd_hora": 30.96,
            "subtotal_usd": 588.18
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "bba612e1-4e03-4f4a-9ee1-296931a70b12",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 112.71,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 112.71
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "0b3d0388-48b9-4235-b2e7-fc77a12d1a8e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3149,
            "kg": 44,
            "subtotal_usd": 13.85,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "946365a9-a42d-453b-84c6-7edb8a110041",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "f5edc32a-3ab6-44fc-a747-20f56100ee2d",
    "nro": "H-3729",
    "nombre": "Barandas - Defensas",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Barandas Rectas Pintadas - 10 un (30%Peon - 3% 1/2 - 67% OF) [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-07-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "d6cee03b-272e-46a4-a9d6-1d48fb51c1eb",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ab3cb57b-b267-4e77-a8c1-30b50632394d",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1556,
            "area_pieza_m2": 0,
            "usd_kg": 1.8600543729540786,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1556,
            "subtotal_m2": 0,
            "subtotal_usd": 2894.24
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "77774b89-3662-48ad-a56a-03253f9bb424",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 156,
            "usd_hora": 15.48,
            "subtotal_usd": 2414.46
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "c426afb6-7946-434c-8a80-8da073b22d18",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 831.37,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 831.37
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "faa9737c-ca7b-46ba-bb79-eb48ce2c6132",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1028,
            "kg": 1556,
            "subtotal_usd": 159.93,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "397d956c-2acb-4ae5-a00e-918298b5401a",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "531ebb98-44ae-4f71-8710-2db0fb782628",
    "nro": "H-4076",
    "nombre": "Barandas - Defensas",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Barandas Variadas Galvanizadas - 3 un (25%Peon - 5% 1/2 - 70% OF)",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "6bfb4332-7066-4dca-b0ff-72e124c365bc",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ed6c4573-db2c-4c63-856b-d235c3e7aa93",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 270,
            "area_pieza_m2": 0,
            "usd_kg": 6.711111111111111,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 270,
            "subtotal_m2": 0,
            "subtotal_usd": 1812
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "794ac076-6aa2-44ab-9fce-9ca7c880e86e",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "1f215bc8-8d7e-4839-8452-0616b85c65ae",
    "nro": "H-4176",
    "nombre": "Barandas - Defensas",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Barandas Variadas Galvanizadas   [Desp: 21.5%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-08-28",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7dad562d-c184-442d-ad34-9021d1924ef7",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "6dc6c439-78aa-415e-aad5-99accbdbf007",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 43124,
            "area_pieza_m2": 0,
            "usd_kg": 1.5374848435963782,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 43124,
            "subtotal_m2": 0,
            "subtotal_usd": 66302.5
          }
        ],
        "mat_generales": [
          {
            "id": "d771cd3a-45e0-4f0b-ada6-ca1d0628e512",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 3207.82,
            "obs": "Importado desde histórico",
            "subtotal_usd": 3207.82
          }
        ],
        "mo_fabricacion": [
          {
            "id": "c5d95c3a-e575-4cf4-ba9c-ebdda1d805a6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 4972,
            "usd_hora": 17.57,
            "subtotal_usd": 87334.05
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "ee64c904-7754-4c3b-afe4-cc068185be3a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 41159.51,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 41159.51
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "cfe982ce-204f-4fe8-a03d-96a46e50ba24",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 2733.42,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 2733.42
          }
        ],
        "corte_pantografo": [
          {
            "id": "a73b54af-24ce-4d95-ade1-c81d16ad0a04",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.286,
            "kg": 43124,
            "subtotal_usd": 12334.3,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e2096b70-e783-4515-8b64-abab2a430a41",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "913c83ba-a2e1-41eb-b1e1-d545b929e62a",
    "nro": "H-4242",
    "nombre": "Barandas - Defensas",
    "cliente": "Bilpa",
    "contacto": "",
    "obra": "",
    "detalle": "Barandas Rectas Pintadas - 34 un (60%Peon - 15% 1/2 - 25% OF)  [Desp: 20.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-10-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "e8616d6e-ad21-4bdc-824c-80efe7dee569",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1385f948-1f69-42d8-b5fa-773ccaa6d697",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1643,
            "area_pieza_m2": 0,
            "usd_kg": 2.1466303786298546,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1643,
            "subtotal_m2": 0,
            "subtotal_usd": 3526.91
          }
        ],
        "mat_generales": [
          {
            "id": "bdd5e2d8-2642-4d13-9965-e208318b7783",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1649.76,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1649.76
          }
        ],
        "mo_fabricacion": [
          {
            "id": "bda234c4-bdd3-4667-aca4-1a7afcf31eaf",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 548,
            "usd_hora": 6.76,
            "subtotal_usd": 3702.19
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "b1ca9a80-5aa6-473b-8357-1729a2479744",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1894.92,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1894.92
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c2c179a3-07cd-4305-bccf-9f51bb88bd3f",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1925,
            "kg": 1643,
            "subtotal_usd": 316.21,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "5b3f9d5e-f71b-4278-96f5-34b5b7ecf9e5",
    "created_at": "2026-07-31T21:50:37.757259Z",
    "updated_at": "2026-07-31T21:50:37.757259Z"
  },
  {
    "id": "4cf8540f-a2c4-46ee-8d50-97463aaca24b",
    "nro": "H-4299",
    "nombre": "Barandas - Defensas",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Barandas Rectas Galvanizadas - 104 un (35%Peon - 25% 1/2 - 40% OF) [Desp: 21.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-11-29",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "81ea1a8f-6287-4886-a033-9ba3f27d089d",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0e941885-9776-4004-8f96-2d0b93cdaedf",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 12830,
            "area_pieza_m2": 0,
            "usd_kg": 1.6385138711548572,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 12830,
            "subtotal_m2": 0,
            "subtotal_usd": 21022.13
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "38ba4975-d5e8-455e-b1e5-002f2f113b8c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 935,
            "usd_hora": 27.85,
            "subtotal_usd": 26038.85
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "54a0d21b-f0d6-4e85-bd90-2d80d1d7beec",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 14375.48,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 14375.48
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "131de6e5-3178-4813-a433-e82f357d1e05",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 407.48,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 407.48
          }
        ],
        "corte_pantografo": [
          {
            "id": "3d68e11a-cfc8-49ac-8ae4-a3c74cf4d23e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1057,
            "kg": 12830,
            "subtotal_usd": 1356.05,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "902e9aa2-c4d1-4cc2-a32b-48ccdbc696f2",
    "created_at": "2026-07-31T21:50:37.758257Z",
    "updated_at": "2026-07-31T21:50:37.758257Z"
  },
  {
    "id": "9fe08fe8-3f8f-43bd-85e5-2fa09c94a926",
    "nro": "H-4308",
    "nombre": "Barandas - Defensas",
    "cliente": "Techint",
    "contacto": "",
    "obra": "",
    "detalle": "Barandas Rectas Galvanizadas - 8 un (20%Peon - 30% 1/2 - 50% OF) [Desp: 30.4%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-12-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "eccbb097-e9c6-42d8-954c-62fc3f3d33e4",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "23cfc8ce-f29e-4700-8b64-dfaeb3f4083c",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1184,
            "area_pieza_m2": 0,
            "usd_kg": 1.7180975772946592,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1184,
            "subtotal_m2": 0,
            "subtotal_usd": 2034.23
          }
        ],
        "mat_generales": [
          {
            "id": "144a44b8-6edf-4962-a3d0-b268873f6187",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 192.52,
            "obs": "Importado desde histórico",
            "subtotal_usd": 192.52
          }
        ],
        "mo_fabricacion": [
          {
            "id": "3a4e9936-6bac-4472-8a85-d6bfd24d0b7c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 102,
            "usd_hora": 23.49,
            "subtotal_usd": 2395.7
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "863b1f4f-ebcc-401a-899b-c88087c27600",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1276.27,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1276.27
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "379da75f-f85c-4b0f-903e-2412e15d1451",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 192.52,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 192.52
          }
        ],
        "corte_pantografo": [
          {
            "id": "926f8688-a0fe-4e7d-9957-295640902598",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4474,
            "kg": 1184,
            "subtotal_usd": 529.76,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "1fcfb95f-467f-41d1-87fb-1bd2eff97719",
    "created_at": "2026-07-31T21:50:37.758257Z",
    "updated_at": "2026-07-31T21:50:37.758257Z"
  },
  {
    "id": "e48003bb-818f-43c1-abd3-6968125b7293",
    "nro": "H-4364",
    "nombre": "Barandas - Defensas",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Baranda a Medida en las Piedras Galv Cal [Desp: 23.6%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-02-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "afb6a91e-32be-402c-a739-afddafb42fcf",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "716c2c13-8a02-4ab7-a4dd-d10c64e3a5ef",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 535,
            "area_pieza_m2": 0,
            "usd_kg": 1.867581440495358,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 535,
            "subtotal_m2": 0,
            "subtotal_usd": 999.16
          }
        ],
        "mat_generales": [
          {
            "id": "ca02fef8-6c71-461f-b6ea-5baf88289d84",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 614.1,
            "obs": "Importado desde histórico",
            "subtotal_usd": 614.1
          }
        ],
        "mo_fabricacion": [
          {
            "id": "aa8d827e-ad7c-4ed9-ab39-5f478fb9fd47",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 165,
            "usd_hora": 18.35,
            "subtotal_usd": 3028.01
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "fd42217e-d09a-401b-9a41-762ce364d91a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 861.07,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 861.07
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "1d1dbee5-fc95-478f-a13e-16c9da59c982",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 223.07,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 223.07
          }
        ],
        "corte_pantografo": [
          {
            "id": "c36967fc-6ca8-4af6-aac6-eb41780b1371",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3264,
            "kg": 535,
            "subtotal_usd": 174.6,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2e1b85bb-878d-48cf-b536-9a6bd045c514",
    "created_at": "2026-07-31T21:50:37.758257Z",
    "updated_at": "2026-07-31T21:50:37.758257Z"
  },
  {
    "id": "80925048-b0a2-45a1-bbfc-d6f43e94bea8",
    "nro": "H-4521",
    "nombre": "Barandas - Defensas",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Defensas Viales Rectas e Inclinadas - Galv Cal. El cliente realizó una observación en referencia al galvanizado y se repite el proceso.  [Desp: 13.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-08-19",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "1aee1dd6-ce69-4900-ac57-51af1942e1bc",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "686c320e-6a06-4189-8532-c1533699940c",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4449,
            "area_pieza_m2": 0,
            "usd_kg": 1.7283771226449367,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4449,
            "subtotal_m2": 0,
            "subtotal_usd": 7689.55
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "85ae7a4e-0683-4fc8-9dca-978afa52dee6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 204,
            "usd_hora": 29.55,
            "subtotal_usd": 6028.38
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "420d2fb8-3387-4412-a462-52e9e7a68309",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 4034.56,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 4034.56
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "f24d56b5-d58f-4467-b39d-9a6a513e1a21",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 285.71,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 285.71
          }
        ],
        "corte_pantografo": [
          {
            "id": "7ec98c80-3841-418a-b0a4-1163f756351d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2454,
            "kg": 4449,
            "subtotal_usd": 1091.8,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "70991716-2320-4724-ad9d-8008bd1ddc16",
    "created_at": "2026-07-31T21:50:37.758257Z",
    "updated_at": "2026-07-31T21:50:37.758257Z"
  },
  {
    "id": "be6b5c39-6e70-4c3a-97da-553be9c978a4",
    "nro": "H-4727",
    "nombre": "Barandas - Defensas",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Barandas a medida galvanizadas en caliente [Desp: 78.6%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-02-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "22c5969e-804d-4ffc-bd43-13c0692f399c",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b691376f-18e8-4d35-ba2f-4976d2c4f944",
            "nombre": "Barandas - Defensas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 683,
            "area_pieza_m2": 0,
            "usd_kg": 2.00831066282283,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 683,
            "subtotal_m2": 0,
            "subtotal_usd": 1371.68
          }
        ],
        "mat_generales": [
          {
            "id": "e8552cf8-657d-4a88-a2e1-f49dd21575df",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 348.09,
            "obs": "Importado desde histórico",
            "subtotal_usd": 348.09
          }
        ],
        "mo_fabricacion": [
          {
            "id": "b840e752-9a02-4e4b-8c34-639d2ceb7ec1",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 81.75,
            "usd_hora": 29.47,
            "subtotal_usd": 2409.23
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "52602946-039a-4f06-9187-d7f559f0a5de",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1002.92,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1002.92
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "43ef2f3a-317c-4779-886a-ab83cfbe5f0e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5096,
            "kg": 683,
            "subtotal_usd": 348.09,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d3862b06-3944-45a2-b17c-612a22b36a68",
    "created_at": "2026-07-31T21:50:37.758257Z",
    "updated_at": "2026-07-31T21:50:37.758257Z"
  },
  {
    "id": "12690b86-b4be-4b59-9479-99ac3b3c0f63",
    "nro": "H-3080",
    "nombre": "Camisas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas Simples de 8m",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-01-12",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "89c1957f-c95f-4abf-a4d4-5dfbfa60f272",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "2e857ec1-b179-4fb0-9bc4-80b667df16c1",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 6071,
            "area_pieza_m2": 0,
            "usd_kg": 1.2698621863504092,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 6071,
            "subtotal_m2": 0,
            "subtotal_usd": 7709.33
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "a37a5360-3e83-433c-a9dd-2cafd3d62e1d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 158,
            "usd_hora": 16.53,
            "subtotal_usd": 2611.23
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "f11b6932-a240-48af-8310-acadce2f2339",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2048,
            "kg": 6071,
            "subtotal_usd": 1243.44,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "26482585-6123-4994-8aa7-f432bbce1fd2",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "8c4f7d83-208a-43f0-8bd7-0c2ad0c2332c",
    "nro": "H-3493",
    "nombre": "Camisas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas Simples con refuerzos de 3/8\" de 12m (ojo a los kilos entre gestsoft y programa) USD/KG menor",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-12-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2a33916d-ba84-4a2e-b818-973460f0cbaa",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "61ff663b-c5b3-481b-88f1-edf5305ffd18",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 47221,
            "area_pieza_m2": 0,
            "usd_kg": 2.0005761538991687,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 47221,
            "subtotal_m2": 0,
            "subtotal_usd": 94469.21
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "cfe36413-d9a9-4444-a461-9db0d6a33881",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1011,
            "usd_hora": 21.52,
            "subtotal_usd": 21757.7
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "80c6f457-0885-467f-b515-61289c1cfe78",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1011,
            "kg": 47221,
            "subtotal_usd": 4773.1,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "94ff4b04-e355-4b7e-a484-07acc8e26bce",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "8d622c27-a2f5-4bc7-ab2b-a55d84b1f59c",
    "nro": "H-3536",
    "nombre": "Camisas",
    "cliente": "Viermond",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con Virola 1/2\" (kg/un aprox).\nIncluye 1 camisa simple [Desp: 90.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-02-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "06eb6f39-1573-4ede-b84e-5af32bb5db5c",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "fffd81a3-2cc2-43a8-812f-1e72d2ca9596",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2248,
            "area_pieza_m2": 0,
            "usd_kg": 2.456773759416153,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2248,
            "subtotal_m2": 0,
            "subtotal_usd": 5522.83
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "fc7da8de-7c6b-49a8-81bb-8613cebe5ac8",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 118,
            "usd_hora": 20.89,
            "subtotal_usd": 2465.03
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "3fc74988-c23e-4f27-854a-62c46fd3ccbb",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2945,
            "kg": 2248,
            "subtotal_usd": 662.14,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e523a44a-d5cc-476b-bccc-edf4e8e9d253",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "1b0faf47-6a18-42b8-b68d-88c304f69ce8",
    "nro": "H-3570",
    "nombre": "Camisas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas recuperables con Virola y Encastres.",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-03-08",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "59d4d6ae-5907-45f7-b2d9-e5998ec66cf3",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "54dc7fdc-f98a-4dbf-9c13-307b844ba822",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 6823,
            "area_pieza_m2": 0,
            "usd_kg": 1.986285942125256,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 6823,
            "subtotal_m2": 0,
            "subtotal_usd": 13552.43
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "7377b2ec-3681-4e30-bb50-59aad71d59fb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 214,
            "usd_hora": 19.69,
            "subtotal_usd": 4212.77
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "523da780-4787-4905-93c7-b32b17ff55d7",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1956,
            "kg": 6823,
            "subtotal_usd": 1334.8,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "104f3b88-6389-471d-b639-9777785f8a09",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "d1864b3e-71df-454c-8b94-1758c9e8e694",
    "nro": "H-3653",
    "nombre": "Camisas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas simples con orejas",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-05-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8711fd83-6ead-4d76-85f2-103dead0224e",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "98b4523f-34a2-4fb5-835f-eaa21d2669a5",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2429,
            "area_pieza_m2": 0,
            "usd_kg": 2.0703610315690453,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2429,
            "subtotal_m2": 0,
            "subtotal_usd": 5028.91
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "bf88b087-fbfb-49d7-8035-feed012701ee",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 59,
            "usd_hora": 29.79,
            "subtotal_usd": 1757.56
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "8274dfe9-572a-48ec-9d10-ea3a600aad2d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2114,
            "kg": 2429,
            "subtotal_usd": 513.54,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "750bce57-35a4-4a90-934b-7028256932cb",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "33992496-bdf0-4c76-8122-9846fa3bb68d",
    "nro": "H-3674",
    "nombre": "Camisas",
    "cliente": "Viermond",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con Virola 1/2\"  y Encastres [Desp: 27.5%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-01",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ef5888f7-b087-48cc-8b75-38fc45875265",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "7149fc03-55a1-4f09-80db-e947935af634",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 905,
            "area_pieza_m2": 0,
            "usd_kg": 2.3550567645495604,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 905,
            "subtotal_m2": 0,
            "subtotal_usd": 2131.33
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "d38d31c0-cbf1-4626-881a-9e3f25783b58",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 48,
            "usd_hora": 24.5,
            "subtotal_usd": 1176.05
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "34242332-cbb4-4793-b3f1-8d5e78f29b9d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5443,
            "kg": 905,
            "subtotal_usd": 492.62,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "810394d6-4e87-4ab8-8b53-aab4d2e331be",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "4a7ae3e9-d05f-4ab8-8e35-07768c21423d",
    "nro": "H-3680",
    "nombre": "Camisas",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas recuperables  con Virola y Encastres",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "4091f24c-1e9b-427f-8d90-b4340c1039d8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b7629b69-f1aa-47f9-81ff-12b0d50dd902",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4394,
            "area_pieza_m2": 0,
            "usd_kg": 2.070137845940515,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4394,
            "subtotal_m2": 0,
            "subtotal_usd": 9096.19
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "3c8f3144-7876-4520-81d5-91ba98f5de19",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 105,
            "usd_hora": 26,
            "subtotal_usd": 2729.51
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "87582fb9-0b30-4eb7-a959-e1732dd464ef",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1967,
            "kg": 4394,
            "subtotal_usd": 864.3,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e4b38b0a-0e10-4c15-8c85-a0c31d75b5cb",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "7cb6ff58-c605-4672-84e5-16f896062daa",
    "nro": "H-3684",
    "nombre": "Camisas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas Simples de 3m",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "30a11b6e-b002-48fe-bbb8-c9481b0084b1",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "fe16d06f-08cc-43ad-aabc-3a94ae81a1a3",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2429,
            "area_pieza_m2": 0,
            "usd_kg": 2.0703610315690453,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2429,
            "subtotal_m2": 0,
            "subtotal_usd": 5028.91
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "8a2cb476-b5e8-44e3-9a17-eb249d5709b2",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 27,
            "usd_hora": 65.09,
            "subtotal_usd": 1757.56
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "6bf1b6c0-28e3-49c0-ac4b-24c6258ca4e9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2114,
            "kg": 2429,
            "subtotal_usd": 513.54,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8a35e709-7f06-474e-a19d-d0869a8dde9e",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "5143dfe0-b925-4e4f-a5a7-e760ef184117",
    "nro": "H-3693",
    "nombre": "Camisas",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas recuperables  con Virola y Encastres",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "c4817fc4-bcd3-4ae0-a37d-90303e4451a2",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "33a316f9-e72f-4166-87d7-41e27e44a435",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2235,
            "area_pieza_m2": 0,
            "usd_kg": 2.0337919393797455,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2235,
            "subtotal_m2": 0,
            "subtotal_usd": 4545.52
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "88cfb52d-a1d5-4b2d-acce-e9197c7fb250",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 38,
            "usd_hora": 35.82,
            "subtotal_usd": 1361.23
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "842d7c4f-4ff4-45c4-b6bc-d45396fd12c9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1961,
            "kg": 2235,
            "subtotal_usd": 438.24,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "c8075954-7ec3-439b-bf8b-54401ddea737",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "6cf4c144-1ddd-4e96-90cf-5906e1a2a696",
    "nro": "H-3703",
    "nombre": "Camisas",
    "cliente": "Viermond",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con Virola 1/2\"  y Encastres [Desp: 62.7%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-07-01",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "40b0e472-6d0c-4865-b631-3716b1e8a15b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1a587dba-a3a0-4d25-9f82-a86cb850d9d2",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2438,
            "area_pieza_m2": 0,
            "usd_kg": 2.334924987866632,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2438,
            "subtotal_m2": 0,
            "subtotal_usd": 5692.55
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "13484d05-8341-4c98-837d-26f5f9217bdd",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 84,
            "usd_hora": 32.21,
            "subtotal_usd": 2705.96
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "efd936d9-00af-4c43-a046-747a1522878f",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5236,
            "kg": 2438,
            "subtotal_usd": 1276.49,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "0d049b85-51c3-43be-8e4d-aa98237adbea",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "abcb83d8-1f74-462f-96d6-76247e4c66e0",
    "nro": "H-3738",
    "nombre": "Camisas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Camisa Simple de 1,5m",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-07-25",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "da61d3d9-0556-4a32-b6d4-38683b37978a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a37fe246-858a-420f-86b7-12641edfe532",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 169,
            "area_pieza_m2": 0,
            "usd_kg": 1.8756543259929073,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 169,
            "subtotal_m2": 0,
            "subtotal_usd": 316.99
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "9de11cd4-3edc-4c1b-85d8-74b2cc96ff88",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 4.2,
            "usd_hora": 45.81,
            "subtotal_usd": 192.4
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "8f16a8d6-c887-4301-a643-f3017373f2ce",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3143,
            "kg": 169,
            "subtotal_usd": 53.12,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "deebf1fa-f802-4be3-ae51-5d2cd4b7533b",
    "created_at": "2026-07-31T21:50:37.763388Z",
    "updated_at": "2026-07-31T21:50:37.763388Z"
  },
  {
    "id": "f05e353e-ab8e-4872-a489-0c5ececc9d10",
    "nro": "H-3768",
    "nombre": "Camisas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Camisa Simple de 1,5m",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-08-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "214c6248-d087-40af-b9dc-7b421a73a241",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "c3e7d1c5-fc4b-47c9-a3f9-27ebe71ba982",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 270,
            "area_pieza_m2": 0,
            "usd_kg": 1.9582335173419434,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 270,
            "subtotal_m2": 0,
            "subtotal_usd": 528.72
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "82001dfc-9fd2-4681-a6b9-b7ed843f54eb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 9,
            "usd_hora": 22.19,
            "subtotal_usd": 199.69
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "5f7d1812-7a61-43ad-b342-f405bc23169e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3022,
            "kg": 270,
            "subtotal_usd": 81.58,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "42627adc-cc9b-45ab-8221-9eeb7251722c",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "070d0dd0-eb38-448e-a4fe-cf93b831c5b7",
    "nro": "H-3791",
    "nombre": "Camisas",
    "cliente": "Viermond",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con Virola 1/2\"  y Encastres + Virola Extra [Desp: 42.6%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-09-08",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "182e216c-d0b7-4908-8dae-8c9052f7f2a3",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "9b6aaa18-db7e-49a5-9b8b-1633ee73fff9",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1172,
            "area_pieza_m2": 0,
            "usd_kg": 2.2750709553628905,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1172,
            "subtotal_m2": 0,
            "subtotal_usd": 2666.38
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "badc4091-8bc0-4443-b831-98c0503194c0",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 55,
            "usd_hora": 23.33,
            "subtotal_usd": 1283.26
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "f1ad0554-9d3a-47b3-b724-d92985a0804e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5208,
            "kg": 1172,
            "subtotal_usd": 610.36,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "0caa675e-df0d-4caf-8415-a3f09bddb4c2",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "beb9fc7a-8e83-4130-b8d5-d52b4ad97eda",
    "nro": "H--",
    "nombre": "Camisas",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas recuperables  con Virola y Encastres",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-10-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "d4083410-feb9-4489-8636-ecc75d6547f7",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "6caee9ee-193f-4a0f-b5a7-cebf2ba407fa",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3247,
            "area_pieza_m2": 0,
            "usd_kg": 1.8259749647652892,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3247,
            "subtotal_m2": 0,
            "subtotal_usd": 5928.94
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "29c61a7f-c0d0-4185-86e4-b44bcc87f257",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 130,
            "usd_hora": 21.71,
            "subtotal_usd": 2821.69
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "2ca05366-a137-46d8-8aff-579aeda9b2d8",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 856.67,
            "subtotal_usd": 856.67,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "3787b3c8-c2d7-4f95-a2d2-bf73f9259b53",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4289,
            "kg": 3247,
            "subtotal_usd": 1392.7,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "afa26c3f-9cb5-4350-b6a9-0af1bae90893",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "2f4c0ad8-f673-4178-87ea-98b6e1ec1ac7",
    "nro": "H-3931",
    "nombre": "Camisas",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas de Ø variado cómunes y con punta reforzada",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-01-31",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "1431c37c-c040-487e-91fc-56d037c278d7",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "327ed6e7-167b-4efe-aa62-e3e491b30402",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 43118,
            "area_pieza_m2": 0,
            "usd_kg": 1.670455592765846,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 43118,
            "subtotal_m2": 0,
            "subtotal_usd": 72026.7
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "846eb7af-6400-41a6-839a-81d1cf1c0772",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1698,
            "usd_hora": 41.62,
            "subtotal_usd": 70666.46
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "9b2896af-d4f2-4567-80d8-a6f91af22cbd",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 4495.45,
            "subtotal_usd": 4495.45,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "0c839f86-77b7-414e-aaed-e98a57d87ccb",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2716,
            "kg": 43118,
            "subtotal_usd": 11711.39,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8a0ef02a-a4ae-4b96-87c5-868dd34adb02",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "1f095704-d8fa-44e6-9019-9073a554811a",
    "nro": "H-4070",
    "nombre": "Camisas",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "3 Camisas L=2500mm\n8 Camisas L=12000mm\n8 Camisas L=14000mm",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-02",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "680a7f40-9aa2-4d31-8989-b075460cf193",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "be1834d0-2948-46fe-b558-bb7c54aa4272",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 31950,
            "area_pieza_m2": 0,
            "usd_kg": 1.2952889651659827,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 31950,
            "subtotal_m2": 0,
            "subtotal_usd": 41384.48
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "137cc2df-40ac-4893-b8b9-ca35c3cd1e1a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 829,
            "usd_hora": 60.7,
            "subtotal_usd": 50322.49
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "b6b0a610-9b35-4b2c-980f-8a84abe0c51b",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 3305.54,
            "subtotal_usd": 3305.54,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "06522d4f-bf95-47fe-b989-ec101d04361e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3107,
            "kg": 31950,
            "subtotal_usd": 9927.49,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "6f5c7571-b252-4ca4-a4b2-83664107d7b4",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "d2eeb4ce-3db3-467f-9d28-0a6ddee08cd2",
    "nro": "H-4074",
    "nombre": "Camisas",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "1 Campana Øint1500mm L=1500mm = 2500 USD\n2 camisas Øint1500mm L=9300mm = 12,508,5 USD/un\n2 Camisas Øint1500mm L= 5500mm (Atraque Barcos) =25,963 USD/un",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7212302e-8591-4103-99eb-14acc37f581b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "98ca8413-91fb-433f-9e32-ca0856ec7488",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 21839,
            "area_pieza_m2": 0,
            "usd_kg": 1.7717369574319195,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 21839,
            "subtotal_m2": 0,
            "subtotal_usd": 38692.96
          }
        ],
        "mat_generales": [
          {
            "id": "6c37411a-06e3-467b-b9f9-074cac467505",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1374.16,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1374.16
          }
        ],
        "mo_fabricacion": [
          {
            "id": "71a0e32b-aa51-44dc-8f03-3c12754c082a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1001,
            "usd_hora": 30.19,
            "subtotal_usd": 30223.15
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "ff8e829e-7df2-4978-a9fd-636e128dfea0",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1599.02,
            "subtotal_usd": 1599.02,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "3f708714-0ab4-42ce-8b5a-c8e9ed9d8340",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3459,
            "kg": 21839,
            "subtotal_usd": 7553.71,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f60b5259-b1a5-4f7b-9236-4183f8c7dcfa",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "ee76fb6b-5b02-4860-a6d9-8dd4bab59ff0",
    "nro": "H-4086",
    "nombre": "Camisas",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas con virola y encastre - 1415 USD\nCamisas con virola y refuerzo - 1911 USD",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "770bd7a9-755e-49ee-8cae-0db2a57c4d0a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "8b425845-abd1-4b88-af23-61193750b8da",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4029,
            "area_pieza_m2": 0,
            "usd_kg": 1.2010068309106803,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4029,
            "subtotal_m2": 0,
            "subtotal_usd": 4838.86
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "d5dd883a-f305-431a-9050-dbeeb71687f7",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 151,
            "usd_hora": 46.68,
            "subtotal_usd": 7049.02
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "4e101310-e85e-45ae-8173-a5217934f0e1",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 584.68,
            "subtotal_usd": 584.68,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "5d8531b6-887e-4a1e-bb3d-bb2056f2224d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6626,
            "kg": 4029,
            "subtotal_usd": 2669.44,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "de33bc94-e6e7-4483-aa01-5035113a8b07",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "d858d362-204c-4a29-ba80-d2c03439325c",
    "nro": "H-4089",
    "nombre": "Camisas",
    "cliente": "Viermond",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con Virola 1/2\" con Encastres [Desp: 54.1%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "0a200b99-25ef-4467-9545-76145560a942",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e25deba0-1064-4e1e-a1b1-a09124fa25a8",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2195,
            "area_pieza_m2": 0,
            "usd_kg": 1.5230517501363536,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2195,
            "subtotal_m2": 0,
            "subtotal_usd": 3343.1
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "df581b7a-a005-4618-97f0-4f1b79c0de19",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 60,
            "usd_hora": 48.48,
            "subtotal_usd": 2908.66
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "0daedc44-5b19-4a9c-9a93-306437fa21f9",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 343.19,
            "subtotal_usd": 343.19,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "67399cc0-d177-481b-a6eb-598c1054d978",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5217,
            "kg": 2195,
            "subtotal_usd": 1145.05,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "959fbc6d-7f8e-4a3c-a4f8-9bc04a8afaba",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "79791bd4-de27-4030-ade5-f2e23feeddc7",
    "nro": "H-4160",
    "nombre": "Camisas",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas con virola y encastre - 1415 USD\nCamisas con virola y refuerzo - 1911 USD [Desp: 55.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-08-17",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "70c4f8bb-e6e2-4b66-b1a2-7d3720e48e9d",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "77443483-a60d-4a70-82ab-a3616711806b",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 933,
            "area_pieza_m2": 0,
            "usd_kg": 1.695260488479074,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 933,
            "subtotal_m2": 0,
            "subtotal_usd": 1581.68
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "14f6f2fd-36e2-441d-97af-68e6608ad231",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 46,
            "usd_hora": 22.08,
            "subtotal_usd": 1015.84
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "fe51147d-aeb9-4b11-a02e-20dae95e7a83",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 105.58,
            "subtotal_usd": 105.58,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "35ab2e2a-bcfc-45a5-a33d-63d3b70d5dcc",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6676,
            "kg": 933,
            "subtotal_usd": 622.9,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "6c53f62e-c473-4f7f-b4ae-8d94f093a1bf",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "fd586b7c-e494-44d9-a49a-72ef93735e91",
    "nro": "H-4190",
    "nombre": "Camisas",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas con virola y encastre - 1415 USD [Desp: 43.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-09-05",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2542647b-770a-4fde-98e2-a451e4dfce29",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "c10b4297-8ab8-43b3-be34-e1ab1fdddd96",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 728,
            "area_pieza_m2": 0,
            "usd_kg": 1.7380140411555565,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 728,
            "subtotal_m2": 0,
            "subtotal_usd": 1265.27
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "80612a1a-fca9-4d12-b33e-084d7e8a3266",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 23,
            "usd_hora": 39.78,
            "subtotal_usd": 914.97
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "cb7a083a-7103-410f-b520-bd994c6204d7",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 94.06,
            "subtotal_usd": 94.06,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "f718d68a-6394-4cb0-8c04-e2fe7af488f4",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7633,
            "kg": 728,
            "subtotal_usd": 555.7,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "32dfd119-d2d6-4be9-81ce-7af5783e8ec6",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "77aea646-e8e9-4535-8dec-f9d195a2b827",
    "nro": "H-4415",
    "nombre": "Camisas",
    "cliente": "Mota Engil",
    "contacto": "",
    "obra": "",
    "detalle": "Puntas de Refuerzo para Camisas  [Desp: 23.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-04-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8eee6bcc-19b5-4ccc-95da-2c64a61c5183",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "bbbfc023-c21b-4643-9459-0fbd513ab0cd",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5509,
            "area_pieza_m2": 0,
            "usd_kg": 1.2568252994577316,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5509,
            "subtotal_m2": 0,
            "subtotal_usd": 6923.85
          }
        ],
        "mat_generales": [
          {
            "id": "f5167e83-4984-4029-9e22-5973137652b8",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 295.98,
            "obs": "Importado desde histórico",
            "subtotal_usd": 295.98
          }
        ],
        "mo_fabricacion": [
          {
            "id": "07b96b3a-62ac-466c-bf6e-809ec3126955",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 76,
            "usd_hora": 46.71,
            "subtotal_usd": 3550.29
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "6905511d-0706-4a9f-bcd2-7558b9010d83",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1183.91,
            "subtotal_usd": 1183.91,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "ac58db57-3530-4a28-a4b0-235a7513046e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2579,
            "kg": 5509,
            "subtotal_usd": 1420.98,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e9a77f82-7791-4d1d-a6e0-05c3cba00a70",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "d81c6bf1-0120-4b23-bab7-ea665fdf8f04",
    "nro": "H-4551",
    "nombre": "Camisas",
    "cliente": "Viermond",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con Virola 1/2\" con Encastres [Desp: 58.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-09-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2ec6a67d-dbba-4c4d-b29c-e6a66a89c7bd",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ba02d787-138b-4e9d-b21e-e9a597a79437",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 845,
            "area_pieza_m2": 0,
            "usd_kg": 1.5460843867601493,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 845,
            "subtotal_m2": 0,
            "subtotal_usd": 1306.44
          }
        ],
        "mat_generales": [
          {
            "id": "486070dd-8235-425d-8ac1-68fa382bc38d",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 8.86,
            "obs": "Importado desde histórico",
            "subtotal_usd": 8.86
          }
        ],
        "mo_fabricacion": [
          {
            "id": "50cce89d-ee86-412c-a5e4-a9f31b72e633",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 38,
            "usd_hora": 41.02,
            "subtotal_usd": 1558.87
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "30044d3f-c1c9-4335-af2f-0979744cb372",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 130.47,
            "subtotal_usd": 130.47,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "86065e81-d27f-4ab7-97c0-f9585aa21dc1",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5152,
            "kg": 845,
            "subtotal_usd": 435.36,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "5013dabf-da73-44c1-8852-fac50531b50a",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "ad7ab1d4-3da7-4251-9fa3-6bcde604d85e",
    "nro": "H-4584",
    "nombre": "Camisas",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con refuerzo 3/16\" en la punta [Desp: 8.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-10-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "9d3a06e4-b169-408c-83a8-f8af9f0733c0",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "2d1c910b-36d7-422e-a9d0-4f13ef3cb150",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2648,
            "area_pieza_m2": 0,
            "usd_kg": 1.0250537256532632,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2648,
            "subtotal_m2": 0,
            "subtotal_usd": 2714.34
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "fd1e6f4f-e4b3-4c47-bbd8-b55f7b433f33",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 156.51,
            "usd_hora": 24.56,
            "subtotal_usd": 3843.29
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "51b25e8b-7883-4766-9271-cae94028a846",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 403.03,
            "subtotal_usd": 403.03,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "0dd474f2-0fc4-4263-84a8-1985d44b918c",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2943,
            "kg": 2648,
            "subtotal_usd": 779.34,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "148f0812-142e-48d9-951f-5d47e3d54220",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "b8c5a10b-f85a-4c7e-9f5c-7e572a717051",
    "nro": "H-4585",
    "nombre": "Camisas",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con Virola 1/2\" con Encastres [Desp: 52.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-10-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "05ec2a78-d6a4-4393-a61f-712874a8679f",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "df9a628f-c5f9-48f0-8cce-2f5bd9f9e9fb",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2096,
            "area_pieza_m2": 0,
            "usd_kg": 1.8837186000512123,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2096,
            "subtotal_m2": 0,
            "subtotal_usd": 3948.27
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "0e945c4a-067c-458e-b70a-eb347599d322",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 59,
            "usd_hora": 54.84,
            "subtotal_usd": 3235.39
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "ed7d6c0a-06a5-4c8e-92e7-53fcca8b41e1",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 586.07,
            "subtotal_usd": 586.07,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "e6b324a2-ab93-4392-b267-dc38c0844b72",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7778,
            "kg": 2096,
            "subtotal_usd": 1630.26,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2757e7a4-c6c3-4438-9b17-dfcf176e2a7d",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "d07c4b8a-bf3a-40db-9f7d-570dddb44ecc",
    "nro": "H-4595",
    "nombre": "Camisas",
    "cliente": "Viermond",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con Virola 1/2\" con Encastres [Desp: 63.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-10-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "618a709f-27bc-46f9-a2c7-a8c3aee30783",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "96bae840-19be-47ff-b9b2-e2bbf4440eb7",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1531,
            "area_pieza_m2": 0,
            "usd_kg": 1.58270483795761,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1531,
            "subtotal_m2": 0,
            "subtotal_usd": 2423.12
          }
        ],
        "mat_generales": [
          {
            "id": "476e9e9c-7380-46ca-b024-033fbc630d22",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 78.05,
            "obs": "Importado desde histórico",
            "subtotal_usd": 78.05
          }
        ],
        "mo_fabricacion": [
          {
            "id": "4cae312d-0312-4edb-b9c5-545fe12916f0",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 100,
            "usd_hora": 24.39,
            "subtotal_usd": 2438.85
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "3eaba740-a982-4d72-8bcb-902154620d97",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 219.02,
            "subtotal_usd": 219.02,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "9cb9b111-32fc-4c92-b2db-64ca72c6d952",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5003,
            "kg": 1531,
            "subtotal_usd": 765.96,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "997ae5ec-e6a7-49ba-9ed1-a5310e8ab823",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "764f5e4f-8ba4-4832-9085-ce76f9b75c2a",
    "nro": "H-4632",
    "nombre": "Camisas",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con refuerzo 3/16\" en la punta [Desp: 46.6%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-11-12",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "49e29791-1446-48c6-b575-d1a6ce564f81",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "c13ddd49-4470-47d0-9b78-c78757ad7b95",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 11502,
            "area_pieza_m2": 0,
            "usd_kg": 1.36144094560921,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 11502,
            "subtotal_m2": 0,
            "subtotal_usd": 15659.29
          }
        ],
        "mat_generales": [
          {
            "id": "da698187-8c88-4a91-8ebd-e0923c507e73",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 3650.39,
            "obs": "Importado desde histórico",
            "subtotal_usd": 3650.39
          }
        ],
        "mo_fabricacion": [
          {
            "id": "61abe5a1-8c99-4aa3-8ac6-9dfa94c47aea",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 199.5,
            "usd_hora": 69.04,
            "subtotal_usd": 13774.45
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "04999e85-2536-4d1c-be1b-5c57785cc130",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1646.25,
            "subtotal_usd": 1646.25,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "5180d942-8e53-452c-8c59-07454e91c4f1",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3582,
            "kg": 11502,
            "subtotal_usd": 4119.61,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "16a15a9d-6031-4d04-84e1-3c391d032a94",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "63e411f8-47c9-42c7-ab8a-79241afcfe68",
    "nro": "H-4643",
    "nombre": "Camisas",
    "cliente": "Consorcio del Puerto",
    "contacto": "",
    "obra": "",
    "detalle": "Virolas 5/8\" con Biselado 30° Talon 0. Penetracion Completa [Desp: 100.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-11-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "c9b21bea-7d20-424e-b5e1-6f39d630be18",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e62be7ba-3566-45d7-992f-1b0e98bf5b8e",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 8880,
            "area_pieza_m2": 0,
            "usd_kg": 1.0576853429082007,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 8880,
            "subtotal_m2": 0,
            "subtotal_usd": 9392.25
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "4532af96-e51b-448f-9805-896966b9228f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 69,
            "usd_hora": 100,
            "subtotal_usd": 6899.75
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "4777e4ad-da2e-4d27-a3ab-2502833741eb",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 2299.13,
            "subtotal_usd": 2299.13,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "0f8f51ec-05b6-4080-b54b-460b8f74346c",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.367,
            "kg": 8880,
            "subtotal_usd": 3258.87,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "503c8ee8-f228-46aa-8b0b-14f30f10f2d3",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "a44417a0-09e2-416d-8c00-880791457617",
    "nro": "H-4665",
    "nombre": "Camisas",
    "cliente": "Consorcio del Puerto",
    "contacto": "",
    "obra": "",
    "detalle": "3 Camisas L:8940mm + 4 Virolas L:2980mm 5/8\" con Biselado 30° Talon 0. Penetracion Completa [Desp: 7.4%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-12-05",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "c17f5bb2-afec-4b82-81cf-d3b908e49c87",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e1768528-c1ff-403f-951d-05e039c0f041",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 30175,
            "area_pieza_m2": 0,
            "usd_kg": 1.0758077879038939,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 30175,
            "subtotal_m2": 0,
            "subtotal_usd": 32462.5
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "b8042059-747c-4d0a-a898-741622ca1d23",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 654,
            "usd_hora": 45.38,
            "subtotal_usd": 29680
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "a45a4889-30d8-4bc6-92c3-a1c7739a249e",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 2782.5,
            "subtotal_usd": 2782.5,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "3a7bcbcb-fb4a-4fed-8f3d-efc42b4eab51",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3074,
            "kg": 30175,
            "subtotal_usd": 9275,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e7d32836-ef28-4c22-bf8f-9f6d387cd221",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "b1e1ad54-73df-425c-8beb-2fccb9f4e200",
    "nro": "H-4679",
    "nombre": "Camisas",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 3/8\" con refuerzo 3/16\" en la punta [Desp: 49.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-12-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "9f9ee89b-f5b9-4e48-97a0-0b67e22c2a93",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d036dab1-98a6-4b09-956b-d614a5c0cf05",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3846,
            "area_pieza_m2": 0,
            "usd_kg": 1.383505289346874,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3846,
            "subtotal_m2": 0,
            "subtotal_usd": 5320.96
          }
        ],
        "mat_generales": [
          {
            "id": "a07ae1ac-dc00-44f4-b0e2-21007de8a277",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1213.32,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1213.32
          }
        ],
        "mo_fabricacion": [
          {
            "id": "879fda91-8d23-47c2-824d-3b42629bedc6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 35,
            "usd_hora": 134.15,
            "subtotal_usd": 4695.2
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "e0c155d1-208c-4094-9b92-2cf8c71f5ec3",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 586.24,
            "subtotal_usd": 586.24,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "26e4c61c-1026-4560-9b04-1fdf415768c9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2949,
            "kg": 3846,
            "subtotal_usd": 1134.28,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "abd8b8c4-8bf1-4385-90b5-e7573fdcf482",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "314c3d0e-f31f-4eb5-a0b8-f7efba2fdf81",
    "nro": "H-4686",
    "nombre": "Camisas",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "Camisas 5/16\" con refuerzo 3/16\" en la punta [Desp: 3600.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-08",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "1964383a-0a70-4675-b60b-03463ef263d8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "66c94664-bf11-4a95-89ef-19cbca1bb268",
            "nombre": "Camisas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 10900,
            "area_pieza_m2": 0,
            "usd_kg": 1.4085736548845478,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 10900,
            "subtotal_m2": 0,
            "subtotal_usd": 15353.45
          }
        ],
        "mat_generales": [
          {
            "id": "6dacb6a1-3919-4b6d-8b3b-7bd094c8099a",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 5700.21,
            "obs": "Importado desde histórico",
            "subtotal_usd": 5700.21
          }
        ],
        "mo_fabricacion": [
          {
            "id": "88eb43f3-b371-4ca1-a04c-bed9f83a50b0",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 196,
            "usd_hora": 65.87,
            "subtotal_usd": 12909.91
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "3d505589-ba32-4b08-b695-28408dab6d0b",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1743,
            "subtotal_usd": 1743,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "0b70eeed-8d0d-4dc8-8547-1dab2b22bd6d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3095,
            "kg": 10900,
            "subtotal_usd": 3373.42,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ad92098d-aa18-4bcd-9506-de5e1be69966",
    "created_at": "2026-07-31T21:50:37.764389Z",
    "updated_at": "2026-07-31T21:50:37.764389Z"
  },
  {
    "id": "0042c8ed-dcba-4988-b1fe-42236a658527",
    "nro": "H-3582",
    "nombre": "Cajones UPN",
    "cliente": "Marinao",
    "contacto": "",
    "obra": "",
    "detalle": "Cajones (4) 140 / (8) 220 / (16) 280 - HDG [Desp: 7.3%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-03-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "107c6c1c-17eb-4cf6-b448-b8679b4eecf5",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "57a5e386-a498-4ae3-a69e-adb2d7000a1a",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5596,
            "area_pieza_m2": 0,
            "usd_kg": 1.914696531637737,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5596,
            "subtotal_m2": 0,
            "subtotal_usd": 10714.64
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "8a4251b6-8e56-424f-841b-c8fd2f1e1baa",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 111,
            "usd_hora": 33.17,
            "subtotal_usd": 3681.42
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "87bd8c7e-932f-4f95-b2fe-fc507e237ed2",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 4946.29,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 4946.29
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "8350501e-d33e-4443-a1ee-f7c06b3542af",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 879.65,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 879.65
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d38f2125-7cf9-4b52-ae62-58ab0fe5fd45",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "1b929d79-c3f0-4ad5-8218-780307c21fd4",
    "nro": "H-3746",
    "nombre": "Cajones UPN",
    "cliente": "Marinao",
    "contacto": "",
    "obra": "",
    "detalle": "Cajones (7) 160 - HDG [Desp: 28.5%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "99d719f0-a7b0-400f-b762-3ac1d28653d1",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1ec1d37e-41f5-481f-a460-8e9562780c63",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 927,
            "area_pieza_m2": 0,
            "usd_kg": 2.0186296758830298,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 927,
            "subtotal_m2": 0,
            "subtotal_usd": 1871.27
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "c65b7bc6-9737-4ef9-adda-c46580f11e55",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 20,
            "usd_hora": 66.53,
            "subtotal_usd": 1330.66
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "674da0b5-805c-4dfd-8a3b-cbb0712bb7ac",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1102.11,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1102.11
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "40839e3e-e257-4dc0-a033-8944ac33519c",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 727.97,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 727.97
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d77f4ca5-3115-4d78-aae4-f0430f897067",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "7fd59cef-f98d-4ef1-be15-3e7d28b7a6a1",
    "nro": "H-3992",
    "nombre": "Cajones UPN",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Apareadas (12) 160 - HDG [Desp: 45.2%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "55d3e8e9-2020-41e0-a05b-d5497e6d5992",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "741b9209-7f77-42fe-8e0b-f87691a323fe",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1470,
            "area_pieza_m2": 0,
            "usd_kg": 1.5535783912557255,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1470,
            "subtotal_m2": 0,
            "subtotal_usd": 2283.76
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "39d8a20f-81b7-4375-aefd-730599c5c5c2",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 68,
            "usd_hora": 27.01,
            "subtotal_usd": 1836.6
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "e12f9aee-4b3c-40b4-8bf5-64d86e925e71",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1388.84,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1388.84
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "b55035da-ae51-4f07-8887-a3a19a735c93",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 200.8,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 200.8
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "0f015da4-c8ad-4574-be70-c92f1b51900c",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "5287fe7a-87b2-4d01-b120-2a6e81f1989c",
    "nro": "H-4251",
    "nombre": "Cajones UPN",
    "cliente": "Ciemsa",
    "contacto": "",
    "obra": "",
    "detalle": "Cajones UPN 140 + Platinas ambos extremos [Desp: 9.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-10-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "b8fa4948-3b82-4697-a74c-29d064d18a7f",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3ebab4d9-2268-4c3e-9a64-07f17f1f69aa",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3182,
            "area_pieza_m2": 0,
            "usd_kg": 1.3582769124068244,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3182,
            "subtotal_m2": 0,
            "subtotal_usd": 4322.04
          }
        ],
        "mat_generales": [
          {
            "id": "03abe5c7-50a3-4e3e-9e06-49726009e59c",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 574.22,
            "obs": "Importado desde histórico",
            "subtotal_usd": 574.22
          }
        ],
        "mo_fabricacion": [
          {
            "id": "ab84a1a3-3f94-4a34-9878-d8b513af62f3",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 263,
            "usd_hora": 16.3,
            "subtotal_usd": 4287.02
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "77d3c843-3221-491e-a496-c17383dd3372",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 3578.36,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 3578.36
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "dfdb9b5b-bf4e-4c99-838a-8be250267df7",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1378,
            "kg": 3182,
            "subtotal_usd": 438.37,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "c648bc59-41df-40a6-a5f7-aa03b9eabacc",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "19cd4c5c-cc21-454f-8f3a-8855da9f99c5",
    "nro": "H-4272",
    "nombre": "Cajones UPN",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "UPN100 (20) - UPN140 (12) Galvanizados y Pintados + Platinas [Desp: 19.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-11-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "b653bf08-7edc-496d-b0cd-010d6723135a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a5011ab5-ac48-42f8-b49a-306c71606254",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 6043,
            "area_pieza_m2": 0,
            "usd_kg": 1.1998550451867807,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 6043,
            "subtotal_m2": 0,
            "subtotal_usd": 7250.72
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "4feb57ac-15a1-4c1a-b1d5-d5ea0d4c10e3",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 324,
            "usd_hora": 27.39,
            "subtotal_usd": 8874.64
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "cfdd4922-c988-47ee-8ce5-db598db193d9",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 6687.01,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 6687.01
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "44d41b35-1279-4785-92d0-a97cedf2cad1",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.362,
            "kg": 6043,
            "subtotal_usd": 2187.63,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "3664daff-3be3-4b22-882d-4834dc94a05e",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "b1fadd50-3b76-45ec-9a78-ebcf8a81ae55",
    "nro": "H-4416",
    "nombre": "Cajones UPN",
    "cliente": "Marinao",
    "contacto": "",
    "obra": "",
    "detalle": "UPN 200 (14) - UPN 160 (42) Galvanizados [Desp: 3.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-04-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "35ffdd14-10d3-4c45-b30c-2ae8dd55deee",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "7a97fce7-3c3d-4486-a546-98dcc98f2215",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 6652,
            "area_pieza_m2": 0,
            "usd_kg": 1.1633087580342725,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 6652,
            "subtotal_m2": 0,
            "subtotal_usd": 7738.33
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "0441fc16-d772-40cf-b666-496952431a7a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 181,
            "usd_hora": 43.56,
            "subtotal_usd": 7884.58
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "6a3927dd-54ab-4091-8d47-82c9975b5599",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 7738.33,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 7738.33
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "f4e41f44-099a-4f89-8d45-72b778400b10",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 438.76,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 438.76
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ac07e298-53b2-409a-adfd-168807a1ee77",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "4f654f9d-b76a-43f2-ba51-3deb3e301301",
    "nro": "H-4547",
    "nombre": "Cajones UPN",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Viga cajón UPN 300 de 6750mm con platinas para acople a muro [Desp: 45.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-09-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "5f2a3908-afbd-4622-9cf3-a0ec7661aa20",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "9673e2ae-9f07-4985-adb9-f1a810b8b346",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 868,
            "area_pieza_m2": 0,
            "usd_kg": 1.6257917488005662,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 868,
            "subtotal_m2": 0,
            "subtotal_usd": 1411.19
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "774c865d-da3b-41cc-82a6-b0ff5dd7df19",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 18.5,
            "usd_hora": 79.17,
            "subtotal_usd": 1464.57
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "cbe4fb5c-c90c-4daf-80c2-cc22707b3409",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1431,
            "kg": 868,
            "subtotal_usd": 124.25,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "827bff14-16eb-4bd9-92a0-07ef43e9ab9e",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "6de0136f-89a4-4a72-85a3-12fdf7c39f0c",
    "nro": "H-4555",
    "nombre": "Cajones UPN",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Viga cajón UPN 300 de 6750mm con platinas para acople a muro [Desp: 45.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-09-17",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "e524710e-2efd-45ff-84ab-3b7bcda32b48",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d049765c-2bcd-4b69-8d46-b929f22ad6ae",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 868,
            "area_pieza_m2": 0,
            "usd_kg": 1.6257917488005662,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 868,
            "subtotal_m2": 0,
            "subtotal_usd": 1411.19
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "601f5381-e5b8-4191-a17a-1094dca86858",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 24,
            "usd_hora": 61.02,
            "subtotal_usd": 1464.57
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "ce7f3d2c-96e8-4279-b7ce-303ffba64e4a",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1431,
            "kg": 868,
            "subtotal_usd": 124.25,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "24fc01b4-5ebf-41ba-9582-f986648f1b56",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "527734af-3425-4afa-8d8b-bae344707294",
    "nro": "H-4612",
    "nombre": "Cajones UPN",
    "cliente": "Marinao",
    "contacto": "",
    "obra": "",
    "detalle": "Viga cajón UPN160 de longitud 2760mm HDG. Platinas adicionales  [Desp: 8.8%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-10-28",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "f535e525-46cb-49ac-8484-53de9f2bc1fc",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d2aaef02-dca6-4916-8046-bd907832bf8b",
            "nombre": "Cajones UPN",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2970,
            "area_pieza_m2": 0,
            "usd_kg": 1.0909288968112498,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2970,
            "subtotal_m2": 0,
            "subtotal_usd": 3240.06
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "8ab61fa3-0c72-484e-98f6-53f13ecb61ef",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 137,
            "usd_hora": 32,
            "subtotal_usd": 4383.68
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "38ce1e90-bd19-4f66-b769-7c20bc479af0",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2827.45,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2827.45
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "f6bac688-b376-46a9-80be-63ee9b230cba",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 666.61,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 666.61
          }
        ],
        "corte_pantografo": [
          {
            "id": "e5eaf32a-c873-4379-8275-f7873a27ffc2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0108,
            "kg": 2970,
            "subtotal_usd": 32.2,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "51f9916d-502e-42dc-bf0c-3fa8aba795a5",
    "created_at": "2026-07-31T21:50:37.765385Z",
    "updated_at": "2026-07-31T21:50:37.765385Z"
  },
  {
    "id": "e6f12698-9fc6-484c-9f92-a84033fcdd91",
    "nro": "H-3807",
    "nombre": "Cerramientos - Cercos - Fachada",
    "cliente": "Ciemsa",
    "contacto": "",
    "obra": "",
    "detalle": "Cerramiento Pintado (24 Módulos - 16 Pilares - 70m de cerco) - UPM. Se consideraron 58h extras [Desp: 13.5%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-09-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "779f0d87-dd06-47c6-b3d0-bfd3cba38746",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0896c52a-75b7-408f-a64f-2ead92ed67e4",
            "nombre": "Cerramientos - Cercos - Fachada",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5124,
            "area_pieza_m2": 0,
            "usd_kg": 1.8517047876106543,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5124,
            "subtotal_m2": 0,
            "subtotal_usd": 9488.14
          }
        ],
        "mat_generales": [
          {
            "id": "f1ca4a5f-7b4d-4bdf-88c1-23ecba31a975",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2596.79,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2596.79
          }
        ],
        "mo_fabricacion": [
          {
            "id": "e0b0a5a7-ea3c-48dc-9b61-f45e2abbdca2",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 714,
            "usd_hora": 19.14,
            "subtotal_usd": 13663.81
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "aaee4690-798a-4104-b756-6eb15a012a84",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 4346.56,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 4346.56
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "621e6b66-2899-4cea-953f-7d3da0abbaf8",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 508.96,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 508.96
          }
        ],
        "corte_pantografo": [
          {
            "id": "a8b03311-9136-476a-9a8c-f667a9454210",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6061,
            "kg": 5124,
            "subtotal_usd": 3105.75,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "55ea0851-aaa8-4617-877d-287e80868aef",
    "created_at": "2026-07-31T21:50:37.767383Z",
    "updated_at": "2026-07-31T21:50:37.767383Z"
  },
  {
    "id": "68cc4deb-654b-44c0-ba21-47d71ce8d64d",
    "nro": "H-4483",
    "nombre": "Cerramientos - Cercos - Fachada",
    "cliente": "Cosud",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura Soporte - Cerramiento Fachada para silleteros o maniobras de limpieza de vidrios en edificios - HDG + Pintura SW: 9.560 kg [Desp: 30.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-06-19",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "43e83fa7-298f-473e-ba65-a075dd79a207",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a3a7500a-9c0c-4ffd-bd5f-a3fab8797501",
            "nombre": "Cerramientos - Cercos - Fachada",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 11018.72,
            "area_pieza_m2": 0,
            "usd_kg": 1.908363749280267,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 11018.72,
            "subtotal_m2": 0,
            "subtotal_usd": 21027.73
          }
        ],
        "mat_generales": [
          {
            "id": "8f76cdbf-a06d-47b1-a2dd-3212db5d327a",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 3082.03,
            "obs": "Importado desde histórico",
            "subtotal_usd": 3082.03
          }
        ],
        "mo_fabricacion": [
          {
            "id": "ed25f80c-5cfc-4ba1-bb45-194eb098b5d1",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 629,
            "usd_hora": 35.97,
            "subtotal_usd": 22623.38
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "55720550-7e02-40bd-9756-a2e4b47f01f7",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 5595.74,
            "subtotal_usd": 5595.74,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "09356970-90ac-43f4-b1b5-1a29c733b526",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 15308.13,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 15308.13
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "0ca283f7-79cd-4bc5-b59a-86f9c2a23440",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 568.32,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 568.32
          }
        ],
        "corte_pantografo": [
          {
            "id": "524944fb-e603-4c02-91a0-29aaf1dd84a0",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1865,
            "kg": 11018.72,
            "subtotal_usd": 2054.68,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "33407d50-f56d-4c90-959e-a3577984f738",
    "created_at": "2026-07-31T21:50:37.767383Z",
    "updated_at": "2026-07-31T21:50:37.767383Z"
  },
  {
    "id": "1799be61-7dea-4f86-a63b-60bed0da9864",
    "nro": "H-2061",
    "nombre": "Columnas",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Columnas de sección variable de 4-6 y 8 metros Galv Cal [Desp: 7.3%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2018-04-19",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "c0a7d067-4d12-424b-8839-2d98f60d4c96",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1353a827-c451-4c74-956c-4e29848a6b31",
            "nombre": "Columnas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1064,
            "area_pieza_m2": 0,
            "usd_kg": 0.9569668112246968,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1064,
            "subtotal_m2": 0,
            "subtotal_usd": 1018.21
          }
        ],
        "mat_generales": [
          {
            "id": "806c6309-1af5-4a74-80a8-ab146a23e81f",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 32.99,
            "obs": "Importado desde histórico",
            "subtotal_usd": 32.99
          }
        ],
        "mo_fabricacion": [
          {
            "id": "e8fd5d78-dddf-44cd-8d1b-70617f5b910d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 63,
            "usd_hora": 20.85,
            "subtotal_usd": 1313.74
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "b094a72c-477e-4742-87b0-f1747961b69b",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 952.58,
            "subtotal_usd": 952.58,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "ca8f8b75-7440-47f1-9288-6694b89daa7e",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 952.58,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 952.58
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "fd133584-f7fe-472f-adae-068fe716375d",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 65.64,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 65.64
          }
        ],
        "corte_pantografo": [
          {
            "id": "9588ab78-e2f8-4757-b817-056168e6f378",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1544,
            "kg": 1064,
            "subtotal_usd": 164.26,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "14030bb7-3985-4d0f-a4cf-50fa78245aef",
    "created_at": "2026-07-31T21:50:37.770819Z",
    "updated_at": "2026-07-31T21:50:37.770819Z"
  },
  {
    "id": "1686671c-8483-45aa-bfe7-91c2b3ec9fa6",
    "nro": "H-3318",
    "nombre": "Columnas",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Columnas de Varias Longitudes Pintadas [Desp: 48.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-08-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "43c24e96-e3a1-4700-9d31-c24a8ae19110",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e671f11e-8218-495b-a703-f8f659f4b387",
            "nombre": "Columnas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 690,
            "area_pieza_m2": 0,
            "usd_kg": 2.8180962369692346,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 690,
            "subtotal_m2": 0,
            "subtotal_usd": 1944.49
          }
        ],
        "mat_generales": [
          {
            "id": "ceeb6934-6029-4711-8e74-2e82e2aca679",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 204.24,
            "obs": "Importado desde histórico",
            "subtotal_usd": 204.24
          }
        ],
        "mo_fabricacion": [
          {
            "id": "048f66d5-acb1-41c8-93df-b96b25f835e8",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 63,
            "usd_hora": 33.14,
            "subtotal_usd": 2088.1
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "b4cc2a51-5913-4048-8178-bb9b186a9282",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 234.55,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 234.55
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c3a6e84b-2c5c-45d7-b592-83056e7da855",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0879,
            "kg": 690,
            "subtotal_usd": 60.63,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "754853ce-60b6-4bcf-9f42-1cfd84220f40",
    "created_at": "2026-07-31T21:50:37.770819Z",
    "updated_at": "2026-07-31T21:50:37.770819Z"
  },
  {
    "id": "65cee476-7582-4456-8564-08379cebd63b",
    "nro": "H-3481",
    "nombre": "Columnas",
    "cliente": "CCH",
    "contacto": "",
    "obra": "",
    "detalle": "Columnas de 15m de seccion variables pintadas con fondo epoxi [Desp: 13.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-12-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "1caa3d8a-adbd-4c6c-9582-e0976357066a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "c66a1daa-83ae-406c-8171-5ecb5ef116d7",
            "nombre": "Columnas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 8662,
            "area_pieza_m2": 0,
            "usd_kg": 3.342024359852984,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 8662,
            "subtotal_m2": 0,
            "subtotal_usd": 28948.62
          }
        ],
        "mat_generales": [
          {
            "id": "9f66e82d-f0f3-4299-b092-c3628f24a569",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 289.4,
            "obs": "Importado desde histórico",
            "subtotal_usd": 289.4
          }
        ],
        "mo_fabricacion": [
          {
            "id": "29b204d2-2751-4601-9a95-66141dd1e0c2",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 190,
            "usd_hora": 31.7,
            "subtotal_usd": 6022.92
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "504961e1-12fd-4294-a79b-606c6ffdf90a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1652.53,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1652.53
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "90b738d9-e50c-43a8-95ef-6f01a306859e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0562,
            "kg": 8662,
            "subtotal_usd": 486.53,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "4d45e6c0-1278-45f6-a632-a5e2fd8cd87a",
    "created_at": "2026-07-31T21:50:37.770819Z",
    "updated_at": "2026-07-31T21:50:37.770819Z"
  },
  {
    "id": "607bfc25-02f0-462d-91ac-c555d1db92c2",
    "nro": "H-3560",
    "nombre": "Columnas",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Columnas Iluminacion de 3m Galv Cal [Desp: 4.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-02-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "f9fd6e60-bc83-4321-b3f5-3ab1952447a8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "16911c22-8bd7-48bb-a8b1-458f8a6bee9b",
            "nombre": "Columnas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1151,
            "area_pieza_m2": 0,
            "usd_kg": 1.6055001457142972,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1151,
            "subtotal_m2": 0,
            "subtotal_usd": 1847.93
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "ced44db0-b3ad-489f-bf41-f2d0b3fd491c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 44,
            "usd_hora": 51.27,
            "subtotal_usd": 2255.97
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "65e43e47-638a-4abe-add2-23d08f85e0c2",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1088.1,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1088.1
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "400b35cd-8203-45ef-8298-3ff809ed6889",
    "created_at": "2026-07-31T21:50:37.770819Z",
    "updated_at": "2026-07-31T21:50:37.770819Z"
  },
  {
    "id": "56ac0b84-3ed0-46de-8ae8-385311f1a1d0",
    "nro": "H-3623",
    "nombre": "Columnas",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Columnas de Varias Longitudes y Brazos de Iluminación HDG + Pintura [Desp: 29.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-04-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "5295de0a-5b13-4b97-854b-ed66cd940dfa",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "4cfc3ce8-0397-47d4-b259-835b08f51db8",
            "nombre": "Columnas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1672,
            "area_pieza_m2": 0,
            "usd_kg": 3.679657537464941,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1672,
            "subtotal_m2": 0,
            "subtotal_usd": 6152.39
          }
        ],
        "mat_generales": [
          {
            "id": "3e682262-e2a4-4cbc-b07b-92c7814bf635",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 94.28,
            "obs": "Importado desde histórico",
            "subtotal_usd": 94.28
          }
        ],
        "mo_fabricacion": [
          {
            "id": "7d5eb288-17b7-43c8-ab7a-12ad06939568",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 200,
            "usd_hora": 20.2,
            "subtotal_usd": 4039.28
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "04bad307-9c00-4abf-a810-0048fb397ea6",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 471.39,
            "subtotal_usd": 471.39,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "df44f676-28e8-4cfa-8166-19284eabf0f7",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2717.78,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2717.78
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "0d051acb-eeee-4bbc-90b6-f2f4acb49d16",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 830.61,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 830.61
          }
        ],
        "corte_pantografo": [
          {
            "id": "fa71a2d5-c031-4327-8605-124e5b153a50",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0564,
            "kg": 1672,
            "subtotal_usd": 94.28,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "934e6935-4235-4dac-bada-d6fba4eda479",
    "created_at": "2026-07-31T21:50:37.770819Z",
    "updated_at": "2026-07-31T21:50:37.770819Z"
  },
  {
    "id": "314b26e5-96e7-4be5-9625-c6d105cb1932",
    "nro": "H-3679",
    "nombre": "Columnas",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Columnas Cuadradas de 4,5 y 6m. Considerar que las horas incluyen 174 brazos [Desp: 6.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "be139c8e-a731-47a6-874b-5b04fce024cc",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "8d9e1a93-b5a6-4e59-91b6-9af2a76ad3dd",
            "nombre": "Columnas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 11653,
            "area_pieza_m2": 0,
            "usd_kg": 2.1973843257236343,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 11653,
            "subtotal_m2": 0,
            "subtotal_usd": 25606.12
          }
        ],
        "mat_generales": [
          {
            "id": "77f558ae-5db8-4f08-ab36-686eaa9a9575",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 7029.13,
            "obs": "Importado desde histórico",
            "subtotal_usd": 7029.13
          }
        ],
        "mo_fabricacion": [
          {
            "id": "5aa6c26c-1701-477d-b66a-0b6e4edebb6b",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1155,
            "usd_hora": 22.6,
            "subtotal_usd": 26108.2
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "10b9c24c-fc87-4509-947b-355c6f6485d4",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 627.6,
            "subtotal_usd": 627.6,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "38cc18fd-78b3-448a-87c0-75d897f5ff04",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 16819.71,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 16819.71
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "874065aa-1961-422d-bb81-4939eaed7db2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1293,
            "kg": 11653,
            "subtotal_usd": 1506.24,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "99da390b-6a64-4b41-8744-a0a0ee0734cc",
    "created_at": "2026-07-31T21:50:37.770819Z",
    "updated_at": "2026-07-31T21:50:37.770819Z"
  },
  {
    "id": "c59e783a-96cd-4a46-bedf-d2ec64581814",
    "nro": "H-3172",
    "nombre": "Cubas",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "[Desp: 1700.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-04-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ce1bf570-e9b8-4e11-a442-7c3eb19d8557",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "8b5a775e-7fb7-4ae3-825b-9b291b00c240",
            "nombre": "Cubas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3916,
            "area_pieza_m2": 0,
            "usd_kg": 1.708734023893568,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3916,
            "subtotal_m2": 0,
            "subtotal_usd": 6691.4
          }
        ],
        "mat_generales": [
          {
            "id": "b8e80a7c-75ee-44e5-8999-f85394d02b0a",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1357.61,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1357.61
          }
        ],
        "mo_fabricacion": [
          {
            "id": "15ae9bb1-2ec5-4840-815f-4d8e08298de4",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 180,
            "usd_hora": 28.6,
            "subtotal_usd": 5147.23
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "5ccca63a-e29c-46ee-852d-38638f688c50",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 5333.79,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 5333.79
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "fcdebc59-7830-4c27-ac3a-13219503a83b",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0717,
            "kg": 3916,
            "subtotal_usd": 280.96,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "7e899ea3-d37a-4261-b4e2-ad361d54a416",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "9216d229-344f-48e1-9489-4339e26222ba",
    "nro": "H-2947",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "El precio incluye el montaje de la plataforma Galvanizada [Desp: 6.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2020-09-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "4e69b843-6d9d-4d21-b166-0d4d4df19e12",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "7b141f17-21f9-4336-aa30-60c01298e7b6",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1598,
            "area_pieza_m2": 0,
            "usd_kg": 1.5361766053335324,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1598,
            "subtotal_m2": 0,
            "subtotal_usd": 2454.81
          }
        ],
        "mat_generales": [
          {
            "id": "4558c6d0-f955-42e1-bfac-74f20e02e7dc",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2961.29,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2961.29
          }
        ],
        "mo_fabricacion": [
          {
            "id": "3185ac7a-efea-4796-b208-a18f61708525",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 163,
            "usd_hora": 30.77,
            "subtotal_usd": 5015.23
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "71120e22-0ff5-4c64-8b82-59b1c14b7309",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 2480.67,
            "subtotal_usd": 2480.67,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ba49ee9d-a975-4935-aa7f-6b79ade43984",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "9e82888a-bc68-41f2-9069-7111a4125598",
    "nro": "H-3070",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "Chediak",
    "contacto": "",
    "obra": "",
    "detalle": "Plataforma para tanque Pintada  [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2020-12-22",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "899d6110-bacf-48f7-8d00-f83d01c773a4",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a04c0beb-2cf0-42e6-8d38-f0494d43e3cc",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1445,
            "area_pieza_m2": 0,
            "usd_kg": 1.0166382654777097,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1445,
            "subtotal_m2": 0,
            "subtotal_usd": 1469.04
          }
        ],
        "mat_generales": [
          {
            "id": "f52d1940-34cd-43d7-aae3-6c9adadd88f8",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 675.7,
            "obs": "Importado desde histórico",
            "subtotal_usd": 675.7
          }
        ],
        "mo_fabricacion": [
          {
            "id": "bd819194-4ee5-4424-a3eb-c31e229a256a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 100,
            "usd_hora": 29.97,
            "subtotal_usd": 2997.19
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "fea35c1d-e673-4336-a4fd-8618e79a1bf2",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 293.81,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 293.81
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "a5d1c3b2-6502-46aa-8d16-f541e9646400",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1829,
            "kg": 1445,
            "subtotal_usd": 264.25,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "0687e803-fab8-4e5c-b678-3473ef657b65",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "6b169c33-ce7a-49ed-91a6-051315133497",
    "nro": "H-4006",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Plataforma para tanque con escalera guarda hombre y barandas [Desp: 51.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-31",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "bd6f09fc-437d-4b52-a5b4-a1a536e5989b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ecabadba-6037-4588-8441-4a1be124c6b0",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 360,
            "area_pieza_m2": 0,
            "usd_kg": 2.076573202054795,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 360,
            "subtotal_m2": 0,
            "subtotal_usd": 747.57
          }
        ],
        "mat_generales": [
          {
            "id": "846d7834-9be8-437a-b8a1-1da7139675bd",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 19.25,
            "obs": "Importado desde histórico",
            "subtotal_usd": 19.25
          }
        ],
        "mo_fabricacion": [
          {
            "id": "5e9729f9-94f1-4538-8523-d16e3dfe1add",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 127,
            "usd_hora": 10.35,
            "subtotal_usd": 1313.88
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "381b7ff9-0b31-4d0f-942f-a88694422a02",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 204.08,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 204.08
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "a2e479fd-0e6a-4f7d-9211-3bf58432c49e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7923,
            "kg": 360,
            "subtotal_usd": 285.22,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d3cc2425-9699-4ebb-ac1f-2df2330902b5",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "63e98dc5-3042-4656-914e-3439d85822d5",
    "nro": "H-4111",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Techos de 30 metros de longitud y 7m de ancho aprox pintados [Desp: 25.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-07-03",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "5ce30eb8-ad20-4252-a9c6-d34af01ad693",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f69583b4-ae5a-4585-bca4-abc16100a1d9",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 13227,
            "area_pieza_m2": 0,
            "usd_kg": 1.5049148474233527,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 13227,
            "subtotal_m2": 0,
            "subtotal_usd": 19905.51
          }
        ],
        "mat_generales": [
          {
            "id": "5a0294ed-c2ee-4b98-87a2-b571ed824997",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 15762.4,
            "obs": "Importado desde histórico",
            "subtotal_usd": 15762.4
          }
        ],
        "mo_fabricacion": [
          {
            "id": "e7c4e1d7-17d1-4967-a517-6357a5469c9a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 694,
            "usd_hora": 23.87,
            "subtotal_usd": 16565.79
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "920dd729-2627-4f46-b6c4-04a1c1020450",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 9487.98,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 9487.98
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "b4069819-0f8e-48ec-9644-a90f3a8495a7",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3032,
            "kg": 13227,
            "subtotal_usd": 4010.32,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "83e94ac9-8337-4432-aad7-61f50b03a6c7",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "2ac44cb5-7b48-4a3d-bc80-267182998978",
    "nro": "H-4197",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Suministro, fabricación y montaje de cerramientos laterales OT 4111 [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-09-08",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "728cfdfd-47ec-41f4-8e4f-84b161c099fa",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "89fc2b85-7f8e-4a85-a69a-892f49119444",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 6421,
            "area_pieza_m2": 0,
            "usd_kg": 1.8588492637447496,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 6421,
            "subtotal_m2": 0,
            "subtotal_usd": 11935.67
          }
        ],
        "mat_generales": [
          {
            "id": "6a59a9e7-7612-4282-a822-0338b0971816",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 16990.82,
            "obs": "Importado desde histórico",
            "subtotal_usd": 16990.82
          }
        ],
        "mo_fabricacion": [
          {
            "id": "b2bac9c6-1e71-4fd2-b8b4-e40cca39fd91",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 677,
            "usd_hora": 5.82,
            "subtotal_usd": 3939.99
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "32687bf9-d381-4b79-9e75-ab722b1d2b73",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 176.75,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 176.75
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "f3a4d84d-85dd-4670-a1df-77d7043ef81e",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1645.41,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 1645.41
          }
        ],
        "corte_pantografo": [
          {
            "id": "69c5493b-8124-4e37-b9b3-ea03513e468c",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0641,
            "kg": 6421,
            "subtotal_usd": 411.35,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f9885b94-7fcd-4c34-9fa9-7f19f6ec5dfe",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "33452d1b-7c17-4499-9c97-434323be8f44",
    "nro": "H-4403",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "Consorcio del Puerto",
    "contacto": "",
    "obra": "",
    "detalle": "Plataforma de trabajo - se pinto como detalle para el cliente (diferencia) [Desp: 16.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-04-05",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "61137160-2ddd-46bb-b346-131e077cc685",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "c9bcf916-e93a-42d9-9a5e-3000d80d73ac",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1056,
            "area_pieza_m2": 0,
            "usd_kg": 1.7473982246709523,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1056,
            "subtotal_m2": 0,
            "subtotal_usd": 1845.25
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "1ba99034-ca2c-49c5-9943-a1d9d99eb85d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 107,
            "usd_hora": 15.25,
            "subtotal_usd": 1631.92
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "384d4065-ea94-4f6c-9006-7f3e6c66a516",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4951,
            "kg": 1056,
            "subtotal_usd": 522.83,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2f5da985-77e8-48d6-afa1-bf4bb03238d2",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "28c125e7-fc88-4aee-83b3-4bd864ed115c",
    "nro": "H-4469",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "Ingener",
    "contacto": "",
    "obra": "",
    "detalle": "Tinglado para sala de Bombas en Nva Palmira. Diseño interno de MMN con conexiones para abulonar en obra. Equipo de 3 personas, el cliente suministra equipos [Desp: 18.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-06-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8d9904a7-dc57-428f-9105-bf1ffe006c51",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0d123764-e3d4-4b5c-af26-4fa62ea2a632",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3298,
            "area_pieza_m2": 0,
            "usd_kg": 1.486270524961241,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3298,
            "subtotal_m2": 0,
            "subtotal_usd": 4901.72
          }
        ],
        "mat_generales": [
          {
            "id": "d06c8f8e-3c75-4554-9db2-d08257b690d4",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 4028.39,
            "obs": "Importado desde histórico",
            "subtotal_usd": 4028.39
          }
        ],
        "mo_fabricacion": [
          {
            "id": "dd62b5de-514a-4de9-a6ee-7913f135ae04",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 176,
            "usd_hora": 39.37,
            "subtotal_usd": 6929.77
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "61ba6a30-005e-4c2b-81ec-f93cac5541aa",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 562.78,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 562.78
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "239cdc9c-9cf0-4e97-92ab-dcc0b81db3d5",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1963,
            "kg": 3298,
            "subtotal_usd": 647.34,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "5891551b-d2f5-4ba8-9e56-c02a078f80fd",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "60ad59af-47b1-4517-aaac-2444a2dd0000",
    "nro": "H-4420",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Plataformas varias con barandas sin terminacion superficial [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-04-17",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "112cac86-0caf-4def-9e15-da2e81625892",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "08922e67-3910-4f25-b573-653c7ae1db15",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 18084,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 18084,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "6a5a2a81-8ffb-4afc-ab65-8bb79d953530",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1487,
            "usd_hora": 29.58,
            "subtotal_usd": 43984.06
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "0a3efc32-c9a9-4735-9e89-a3cbae4a3452",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4678,
            "kg": 18084,
            "subtotal_usd": 8459.94,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "90b5a924-8e94-44cc-ba45-1b5b8ab3e8e9",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "1e32a7ac-c5a0-4efc-b48d-9c16033550bf",
    "nro": "H-4546",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Refugio Peatonal para Estaciones. Complicaciones con los suministros [Desp: 16.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-09-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "220b3af8-7704-4c09-8d68-a0cf13a6e63a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3162ac68-2d1c-4606-8609-c7a6ed66605d",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 563,
            "area_pieza_m2": 0,
            "usd_kg": 1.3372982459362601,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 563,
            "subtotal_m2": 0,
            "subtotal_usd": 752.9
          }
        ],
        "mat_generales": [
          {
            "id": "77ae8ffe-0f3a-455c-a10b-ea8a68006587",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1174.32,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1174.32
          }
        ],
        "mo_fabricacion": [
          {
            "id": "01a23467-32ce-4638-a31f-11b30df52d7d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 49.5,
            "usd_hora": 25.35,
            "subtotal_usd": 1254.59
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "50c3cd3d-bb96-4bb7-8ea4-3a875a4a438f",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 622.46,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 622.46
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "efc10eea-b7b1-45a3-8fb4-a4dc9447121d",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 40.14,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 40.14
          }
        ],
        "corte_pantografo": [
          {
            "id": "50122665-297d-41a0-bd4d-b5a682c70ca8",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3119,
            "kg": 563,
            "subtotal_usd": 175.59,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "cf927462-18df-4095-97a4-23e19425d321",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "f10a3338-e3c5-4dea-af5b-4e01c125e7ff",
    "nro": "H-4812",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Tinglado para sala de Bombas en Nva Palmira. Diseño interno de MMN con conexiones para abulonar en obra. Equipo de 4 personas, el cliente suministra equipos. Ampliación [Desp: 33.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-05-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "90b33322-80b6-4002-80b0-e50d3191c1c7",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ba107916-1af5-4103-a14f-5434d6ab76ae",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2104,
            "area_pieza_m2": 0,
            "usd_kg": 1.8125267517941335,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2104,
            "subtotal_m2": 0,
            "subtotal_usd": 3813.56
          }
        ],
        "mat_generales": [
          {
            "id": "eccef8c9-1a19-427a-bc9d-edebc9732cea",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 4036.2,
            "obs": "Importado desde histórico",
            "subtotal_usd": 4036.2
          }
        ],
        "mo_fabricacion": [
          {
            "id": "48dccff5-1c18-4d55-bd9c-55f61b878898",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 202,
            "usd_hora": 46.15,
            "subtotal_usd": 9322.48
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "4ca4fb3a-e208-46f8-beaa-d409387f5ac6",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 647.51,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 647.51
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "c5adbd81-ffd3-46b7-b7d1-5c0faba87ea4",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 89.87,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 89.87
          }
        ],
        "corte_pantografo": [
          {
            "id": "2572f562-ef6e-403f-b663-6914be85e70f",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6466,
            "kg": 2104,
            "subtotal_usd": 1360.38,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a8654da3-9ea3-4d38-864f-222dee6fd8b8",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "a393178c-ad85-4138-aa03-ab407d7da31f",
    "nro": "H-4830",
    "nombre": "Cubiertas - Techos - Plataforma",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "[Desp: 30.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-05-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "4669eb14-949c-4856-abf1-bd9a82cb53c1",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "9bc4277a-21d1-41e0-98b5-d14302ee5c32",
            "nombre": "Cubiertas - Techos - Plataforma",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2427,
            "area_pieza_m2": 0,
            "usd_kg": 1.3826174099350352,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2427,
            "subtotal_m2": 0,
            "subtotal_usd": 3355.61
          }
        ],
        "mat_generales": [
          {
            "id": "2084477d-c580-4ce7-9251-235c68b53167",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2658.83,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2658.83
          }
        ],
        "mo_fabricacion": [
          {
            "id": "df483689-8827-4789-9264-5bf87cf0f235",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 353,
            "usd_hora": 20.56,
            "subtotal_usd": 7258.32
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "40fbf966-83fb-4686-b045-375907b4abc7",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 297.6,
            "subtotal_usd": 297.6,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "9c3efd4e-975f-4668-a378-ef3966cd68c9",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2635.66,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2635.66
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "1e034d32-45c1-4877-bd25-185fb27799dd",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.492,
            "kg": 2427,
            "subtotal_usd": 1193.98,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "1cf41a20-af80-49da-8262-3a463c769f47",
    "created_at": "2026-07-31T21:50:37.772817Z",
    "updated_at": "2026-07-31T21:50:37.772817Z"
  },
  {
    "id": "dd997096-7979-418e-9c75-acd7f8eb4012",
    "nro": "H-3183",
    "nombre": "Escaleras",
    "cliente": "Gonzalez Conde",
    "contacto": "",
    "obra": "",
    "detalle": "Escalera de Varios Modulos [Desp: 6.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-04-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "99b9defb-99a5-4004-a489-c8fbc2c86e40",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0e2d7481-a624-46ac-9680-54e8b984efbf",
            "nombre": "Escaleras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 49517,
            "area_pieza_m2": 0,
            "usd_kg": 1.4692176097167613,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 49517,
            "subtotal_m2": 0,
            "subtotal_usd": 72751.25
          }
        ],
        "mat_generales": [
          {
            "id": "66b047d1-2838-4b11-bd09-0977bbcdba6e",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 18227.44,
            "obs": "Importado desde histórico",
            "subtotal_usd": 18227.44
          }
        ],
        "mo_fabricacion": [
          {
            "id": "60ce0063-9ab4-4e0a-9a55-17782b6bc5c7",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 4624,
            "usd_hora": 18.78,
            "subtotal_usd": 86857.7
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "9ebce7e8-493d-4710-b900-eb79f870764c",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 38492.72,
            "subtotal_usd": 38492.72,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "64e62091-b9f7-4a07-8a88-bfd622cd23de",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 4437.98,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 4437.98
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "fab3b852-19a2-40a8-9665-3337a3294bc0",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1294,
            "kg": 49517,
            "subtotal_usd": 6407.91,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d7f0e812-46db-4c66-8057-9e3fc6c97536",
    "created_at": "2026-07-31T21:50:37.773818Z",
    "updated_at": "2026-07-31T21:50:37.773818Z"
  },
  {
    "id": "9bb1b8da-30c0-4ab2-a411-117e00f60f73",
    "nro": "H-3633",
    "nombre": "Escaleras",
    "cliente": "Schmidt",
    "contacto": "",
    "obra": "",
    "detalle": "Escalera de Varios Modulos [Desp: 20.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-04-27",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "3d9a4f19-a110-4e68-87ef-c4df58a2a211",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "cd519da4-3390-4e1c-9943-01abce3392e9",
            "nombre": "Escaleras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3463,
            "area_pieza_m2": 0,
            "usd_kg": 2.177783489755119,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3463,
            "subtotal_m2": 0,
            "subtotal_usd": 7541.66
          }
        ],
        "mat_generales": [
          {
            "id": "37c77962-3ae3-4af3-b65a-7d10cdc68379",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 811.88,
            "obs": "Importado desde histórico",
            "subtotal_usd": 811.88
          }
        ],
        "mo_fabricacion": [
          {
            "id": "77bf268b-1524-4ff0-9cea-4268c6cd9235",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 225,
            "usd_hora": 47.8,
            "subtotal_usd": 10754.73
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "54a2cd15-4714-4dea-bc2b-1cdfbf363cbc",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 508.23,
            "subtotal_usd": 508.23,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "379fae38-b699-41d8-9d3e-e02e7ea4d25f",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 404.86,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 404.86
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "48423b0b-a7ef-4bfb-a7ef-82174538abfd",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 540.54,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 540.54
          }
        ],
        "corte_pantografo": [
          {
            "id": "66bd2c19-81fb-4233-80c6-ba5c74195eb2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4297,
            "kg": 3463,
            "subtotal_usd": 1488.09,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d0b70632-2af7-4bfe-9da4-610fbc2ed935",
    "created_at": "2026-07-31T21:50:37.773818Z",
    "updated_at": "2026-07-31T21:50:37.773818Z"
  },
  {
    "id": "6bc06ec2-5ad1-4d64-9062-18ac564a3fe1",
    "nro": "H-3795",
    "nombre": "Escaleras",
    "cliente": "Timber",
    "contacto": "",
    "obra": "",
    "detalle": "Escalera de Gato. Se incluye en el suministro linga guarda vida [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-09-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ced1852b-1dfc-4f43-b5a2-9f640d90a1cf",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3976333f-c842-4daf-9f9e-4641d1e1447a",
            "nombre": "Escaleras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 324,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 324,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [
          {
            "id": "8a586b2a-fd34-454c-bd10-b076b50077a6",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 687.64,
            "obs": "Importado desde histórico",
            "subtotal_usd": 687.64
          }
        ],
        "mo_fabricacion": [
          {
            "id": "29f2c3f3-b560-4b14-9c66-226e1f5aa368",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 45,
            "usd_hora": 22.62,
            "subtotal_usd": 1017.98
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "2805a456-885d-42c7-b3ac-240bfb14a642",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 67.42,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 67.42
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "6873ee21-f976-4e0f-8127-e395acc65263",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0832,
            "kg": 324,
            "subtotal_usd": 26.97,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "7701d1f0-4562-4825-9369-8c80e8115a39",
    "created_at": "2026-07-31T21:50:37.773818Z",
    "updated_at": "2026-07-31T21:50:37.773818Z"
  },
  {
    "id": "a10ab1cf-5ecc-4f93-a7bc-de4e5b46f754",
    "nro": "H-4229",
    "nombre": "Escaleras",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Escalera de 1 modulo pintada + Baranda propia y otros metros galv cal [Desp: 31.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-10-05",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "b926ea12-a8f7-47d2-bc03-e268ca349190",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f59bd8f3-4e52-4450-9fbd-ffd946063238",
            "nombre": "Escaleras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4069,
            "area_pieza_m2": 0,
            "usd_kg": 2.485551204593555,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4069,
            "subtotal_m2": 0,
            "subtotal_usd": 10113.71
          }
        ],
        "mat_generales": [
          {
            "id": "b6214291-1839-480c-a38b-2bc02777b09b",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1155.63,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1155.63
          }
        ],
        "mo_fabricacion": [
          {
            "id": "68cc3d46-a075-440f-b3c4-2f25a072900f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 485,
            "usd_hora": 17.53,
            "subtotal_usd": 8504.18
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "e6c29d6a-b9dc-4d80-9d61-bb02e79337e7",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 3466.89,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 3466.89
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "9b824494-3356-4ca3-a316-e3b8149b06b1",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6084,
            "kg": 4069,
            "subtotal_usd": 2475.6,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f5f09018-8159-4af2-bdad-b9908f7007b4",
    "created_at": "2026-07-31T21:50:37.773818Z",
    "updated_at": "2026-07-31T21:50:37.773818Z"
  },
  {
    "id": "a60e56a2-b37c-4326-b7af-42d090477215",
    "nro": "H-4449",
    "nombre": "Escaleras",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "12 Tramos de escaleras y 6 plataformas con ruedas y barandas. El cliente suministra los materiales. Posible error asignación de horas [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-05-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "bf8663ad-604c-4751-a688-309b19fd4a4b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "fdb564fc-fa2e-4193-8b3c-41db90d791de",
            "nombre": "Escaleras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5736,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5736,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "e429f097-1493-4d28-a0f9-722f70ef5e9d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 815,
            "usd_hora": 15.6,
            "subtotal_usd": 12717.59
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "ed0584e1-d8b4-45aa-89bb-fadc9b6732b7",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6884,
            "kg": 5736,
            "subtotal_usd": 3948.41,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9d80b557-6862-4dce-a89e-5bc2eca0f51e",
    "created_at": "2026-07-31T21:50:37.773818Z",
    "updated_at": "2026-07-31T21:50:37.773818Z"
  },
  {
    "id": "8fc4f418-1e73-4d01-8f56-9ab2d52f37aa",
    "nro": "H-4726",
    "nombre": "Escaleras",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Escalera con 2 descansos intermedios y un piso.  [Desp: 19.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-02-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "4d406513-c4ed-4d09-810e-8504760f3818",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "7a72b2f0-527f-4363-ae8d-289f470a67e9",
            "nombre": "Escaleras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2002,
            "area_pieza_m2": 0,
            "usd_kg": 1.0662225387409967,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2002,
            "subtotal_m2": 0,
            "subtotal_usd": 2134.58
          }
        ],
        "mat_generales": [
          {
            "id": "3c509791-d110-4ca4-8d25-72b5633f4df1",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2156.23,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2156.23
          }
        ],
        "mo_fabricacion": [
          {
            "id": "50377e2e-27df-439f-a1da-1248b76128c4",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 431,
            "usd_hora": 15.48,
            "subtotal_usd": 6671.74
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "84faa614-1a5c-4c1e-aa34-58fa1c5a7b40",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1395.53,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1395.53
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "e594fd0e-fcf0-47e4-9523-1d4babc478c2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4205,
            "kg": 2002,
            "subtotal_usd": 841.92,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "5b364518-c58d-4525-8f0d-532e8ce96bc0",
    "created_at": "2026-07-31T21:50:37.774322Z",
    "updated_at": "2026-07-31T21:50:37.774322Z"
  },
  {
    "id": "9201eb5e-c364-4547-bdcd-462b7db5ad34",
    "nro": "H-2694",
    "nombre": "Escalera Marinera",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "2 Manos de Fondo y 3 Sintético (0,5L/m2)",
    "tipo_trabajo": "Fabricación",
    "fecha": "2019-11-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "903aa755-ec2b-4eb2-9216-f522381c3e06",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "abc622e4-d6f0-41d5-9588-93cbe2ca26ef",
            "nombre": "Escalera Marinera",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 257,
            "area_pieza_m2": 0,
            "usd_kg": 1.045051174873104,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 257,
            "subtotal_m2": 0,
            "subtotal_usd": 268.58
          }
        ],
        "mat_generales": [
          {
            "id": "b776be01-dcff-4ebd-831c-baa37e8cdd73",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 83.37,
            "obs": "Importado desde histórico",
            "subtotal_usd": 83.37
          }
        ],
        "mo_fabricacion": [
          {
            "id": "849bdc79-f410-4464-91b4-aa1009363bdf",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 62,
            "usd_hora": 20.26,
            "subtotal_usd": 1256.41
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "2f38e5c0-7d3c-4a2a-9421-e1e62d575e31",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 234.57,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 234.57
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "bb6dda47-0cdc-440f-bc2f-837af5a3570f",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 54.8,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 54.8
          }
        ],
        "corte_pantografo": [
          {
            "id": "9c8d7213-fa20-4818-aa88-58245f67231e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0711,
            "kg": 257,
            "subtotal_usd": 18.27,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "346cff9d-e1a7-4d0a-942d-197c12304a68",
    "created_at": "2026-07-31T21:50:37.775327Z",
    "updated_at": "2026-07-31T21:50:37.775327Z"
  },
  {
    "id": "ea840f1d-fcdb-45b6-888c-148247cae399",
    "nro": "H-2343",
    "nombre": "Escalera Marinera",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Galvanizadas en caliente",
    "tipo_trabajo": "Fabricación",
    "fecha": "2019-02-25",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "22149bda-62cb-4ff9-9420-3125c3f855a3",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e0c398be-381e-4991-887a-126e27ad152e",
            "nombre": "Escalera Marinera",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 146,
            "area_pieza_m2": 0,
            "usd_kg": 1.0682529449362834,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 146,
            "subtotal_m2": 0,
            "subtotal_usd": 155.96
          }
        ],
        "mat_generales": [
          {
            "id": "cecfe42a-0b3e-4f98-b94d-afb3ac05cc9f",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 4.46,
            "obs": "Importado desde histórico",
            "subtotal_usd": 4.46
          }
        ],
        "mo_fabricacion": [
          {
            "id": "e67d058b-f9dc-45ba-a6e9-34f7b25a2420",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 11,
            "usd_hora": 60.06,
            "subtotal_usd": 660.65
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "8ed97d7b-fdf9-4343-9e43-34223115d0d0",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 157.38,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 157.38
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "e40019b5-d6fe-4791-aab6-9c97572c9f37",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 101.55,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 101.55
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "58c279c8-dd76-4473-920f-c1b8e3f59173",
    "created_at": "2026-07-31T21:50:37.775327Z",
    "updated_at": "2026-07-31T21:50:37.775327Z"
  },
  {
    "id": "56f025b2-d65d-44fb-bb3e-e5718fedcd6f",
    "nro": "H-2205",
    "nombre": "Escalera Marinera",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "1 Mano de fondo y 2 de sintético.\n No inc materiales",
    "tipo_trabajo": "Fabricación",
    "fecha": "2018-10-03",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "3932905f-f825-4e15-bce9-530d7627752b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "cc422d15-782e-4fb8-8e4a-4f9a13e0d831",
            "nombre": "Escalera Marinera",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 178.5,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 178.5,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [
          {
            "id": "2c8cde58-a091-45b5-8fa8-042fb600ab14",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 19.15,
            "obs": "Importado desde histórico",
            "subtotal_usd": 19.15
          }
        ],
        "mo_fabricacion": [
          {
            "id": "12bb8561-37f5-433e-86a7-c806967cb979",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 61,
            "usd_hora": 26.75,
            "subtotal_usd": 1631.84
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "c28aaf4f-016c-4e34-9fda-587b5b00476a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 68.79,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 68.79
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c6bba55b-0369-48bb-956f-754c066c42bd",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1693,
            "kg": 178.5,
            "subtotal_usd": 30.21,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "1bad2002-5129-4ff8-869a-bc3773acd30a",
    "created_at": "2026-07-31T21:50:37.775327Z",
    "updated_at": "2026-07-31T21:50:37.775327Z"
  },
  {
    "id": "87185056-50b0-4b3d-8d21-bc9fd16d9991",
    "nro": "H-1394",
    "nombre": "Escalera Marinera",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "2 Manos de Fondo y 2 Sintético",
    "tipo_trabajo": "Fabricación",
    "fecha": "2016-06-22",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "70432edb-205d-484f-8e29-fdb29b330827",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "4da12086-066e-4a74-a059-7471ea7cf361",
            "nombre": "Escalera Marinera",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 216,
            "area_pieza_m2": 0,
            "usd_kg": 0.9502434753406256,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 216,
            "subtotal_m2": 0,
            "subtotal_usd": 205.25
          }
        ],
        "mat_generales": [
          {
            "id": "c6a1ec76-c075-4953-a3e0-0867fe8a4330",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 160.97,
            "obs": "Importado desde histórico",
            "subtotal_usd": 160.97
          }
        ],
        "mo_fabricacion": [
          {
            "id": "1ab6d687-c1c0-4f26-8833-353fb0337c85",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 42,
            "usd_hora": 20.21,
            "subtotal_usd": 849
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "4ec7f80f-16b7-45f6-9798-fb457dd11e1b",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 70.04,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 70.04
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "4e892fe1-0546-4121-b7ec-39b899e9d387",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0219,
            "kg": 216,
            "subtotal_usd": 4.73,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "12888f0f-f8c1-48f1-9b58-6609f41d982a",
    "created_at": "2026-07-31T21:50:37.775327Z",
    "updated_at": "2026-07-31T21:50:37.775327Z"
  },
  {
    "id": "fdb19819-9722-4a5b-8e58-adacadd082cc",
    "nro": "H-4471",
    "nombre": "Herreria",
    "cliente": "Particular",
    "contacto": "",
    "obra": "",
    "detalle": "6 Rejas Fijas - 2 Puertas Batientes Pintadas  [Desp: 17.7%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-06-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "b09b0b89-b09b-46f9-93b9-371c310ccd07",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "6cc07b30-a36b-4b9f-afeb-53ea71de43eb",
            "nombre": "Herreria",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 309,
            "area_pieza_m2": 0,
            "usd_kg": 1.3977624576321825,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 309,
            "subtotal_m2": 0,
            "subtotal_usd": 431.91
          }
        ],
        "mat_generales": [
          {
            "id": "44a822ec-24b8-47f6-b063-72626aec2399",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 308.84,
            "obs": "Importado desde histórico",
            "subtotal_usd": 308.84
          }
        ],
        "mo_fabricacion": [
          {
            "id": "82fce7ca-cf08-4ca0-bdd8-1488de7a7b51",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 96,
            "usd_hora": 19.24,
            "subtotal_usd": 1847.15
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "7d6cbd64-2faf-43f1-b9b1-32ac795ae093",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 205.01,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 205.01
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "e9f18e91-2e81-4ff2-9c83-23e12268dce6",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3466,
            "kg": 309,
            "subtotal_usd": 107.09,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "20bc3a23-6dcf-407a-a2a7-5ca97aab2456",
    "created_at": "2026-07-31T21:50:37.775327Z",
    "updated_at": "2026-07-31T21:50:37.775327Z"
  },
  {
    "id": "2b63838c-ce43-4095-bee1-7de9f5d15e66",
    "nro": "H-3558",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Genba",
    "contacto": "",
    "obra": "",
    "detalle": "1 portico de 2300x1680mm en tubo cuadrado 120x120x4.8mm. Pintado [Desp: 25.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-02-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "80a550db-bad3-44be-b418-7c29b2014966",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d89fe174-1799-4edb-911b-e574da4a7619",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 153,
            "area_pieza_m2": 0,
            "usd_kg": 2.410402790992706,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 153,
            "subtotal_m2": 0,
            "subtotal_usd": 368.79
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "affea63b-4f40-481c-883c-8742a24c6b5e",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 25,
            "usd_hora": 22.19,
            "subtotal_usd": 554.8
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "b4b81a86-82f9-4460-9df3-2a1b0390cb54",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 582.3,
            "subtotal_usd": 582.3,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "a2230e5b-4415-474f-b3c9-7a9b33a1ed5a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 111.61,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 111.61
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "2b33853e-477a-414c-bd1a-f4076ec91a80",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 51.76,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 51.76
          }
        ],
        "corte_pantografo": [
          {
            "id": "452ebb79-e2c8-4c29-ad7f-c4da6021bcfd",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2009,
            "kg": 153,
            "subtotal_usd": 30.73,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b7db39ee-3ff0-4c1b-af66-300ae579fbc4",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "03c0a1fd-4e5e-4e72-96a8-31647126b5dc",
    "nro": "H-4088",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Teyma",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura soporte para cartel Obra Hospital del Cerro. Fabricada en caño (100x100x6,35)mm- IPN 300 [Desp: 17.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2547931d-af8e-46d8-b7ac-97dc34fb41a3",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "63a243c5-8055-4fc3-8c04-b2e38c3f0f00",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 9690,
            "area_pieza_m2": 0,
            "usd_kg": 1.6516138356502883,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 9690,
            "subtotal_m2": 0,
            "subtotal_usd": 16004.14
          }
        ],
        "mat_generales": [
          {
            "id": "1a799cb0-424a-4c54-877b-f5f94e7aa83b",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 8914.65,
            "obs": "Importado desde histórico",
            "subtotal_usd": 8914.65
          }
        ],
        "mo_fabricacion": [
          {
            "id": "06636724-2aad-4ce0-96c7-fd000f33d495",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 432,
            "usd_hora": 30.39,
            "subtotal_usd": 13127.99
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "2e2c7e32-6e10-489b-805d-b59f43881203",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 4311.87,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 4311.87
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "a0827818-8b7b-4697-a358-538da5c74197",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5244,
            "kg": 9690,
            "subtotal_usd": 5081.35,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "5a106773-9e2e-4bb1-8531-c3daacd40a2a",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "d5ca5feb-0ec9-4e92-8ed6-38e642f8c506",
    "nro": "H-4352",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Estructuras de Perfiles tipo Mesa [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-02-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8e431602-4965-4bda-aacf-5bed26bdce08",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "dd37e066-0396-4c56-93f9-073394050ba5",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 23000,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 23000,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [
          {
            "id": "bf147718-2fd7-4e25-92fc-5d57e4c7e846",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2347.68,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2347.68
          }
        ],
        "mo_fabricacion": [
          {
            "id": "dbbd27e8-a729-42f6-9f4a-4350321dd724",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 2272,
            "usd_hora": 22.45,
            "subtotal_usd": 50997.25
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "ab38bd69-541c-4b2d-9321-1dacfb3f079e",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 7282.47,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 7282.47
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "58d9eb00-f9de-4e4f-aa6e-ff6f23583586",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.194,
            "kg": 23000,
            "subtotal_usd": 4462.59,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "af3d2f7c-5282-472e-998d-4930b3311d09",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "e75cfff4-072b-4d67-9736-c7ba8cc081a2",
    "nro": "H-4404",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Consorcio Puerto",
    "contacto": "",
    "obra": "",
    "detalle": "Se presupuestaron 47,400kg - 3,67USD/kg y pesó 48,529kg [Desp: 15.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-04-05",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "dc9ef6be-34e7-4580-8412-1d674fe10237",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "6b42c4b6-962d-4067-a96c-ab230b56b7f8",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 48564.37,
            "area_pieza_m2": 0,
            "usd_kg": 1.062557732615549,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 48564.37,
            "subtotal_m2": 0,
            "subtotal_usd": 51602.45
          }
        ],
        "mat_generales": [
          {
            "id": "d2631d26-fdb1-4bf9-85f9-7081f1512988",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 28503.71,
            "obs": "Importado desde histórico",
            "subtotal_usd": 28503.71
          }
        ],
        "mo_fabricacion": [
          {
            "id": "136736b6-5f98-404e-9a35-1adbbf84f6d2",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 3047,
            "usd_hora": 23.23,
            "subtotal_usd": 70775.11
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "2d8dc58c-bddb-438d-8e9d-b6245ef85d67",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 12288.81,
            "subtotal_usd": 12288.81,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "0e3d3272-320c-4f50-996e-f899b5a91a6a",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 985.92,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 985.92
          }
        ],
        "corte_pantografo": [
          {
            "id": "60adbe3b-f88a-4822-a3f5-cce515d4f3d4",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2023,
            "kg": 48564.37,
            "subtotal_usd": 9824.01,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9ef8ab1c-027e-4b4a-b94a-d73bb0f71d76",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "b795c50b-9620-4dc3-82a8-7f04d39e5840",
    "nro": "H-4437",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Consorcio Puerto",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura auxiliar para arriostramiento\nde pilotes. Se realizaron horas extras y nocturnas [Desp: 24.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-04-30",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "56860a6b-f29a-43ca-9dd7-ebd03af6766f",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "de416c89-b66e-4f2b-8737-3fe19bda04a8",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 11633,
            "area_pieza_m2": 0,
            "usd_kg": 1.4642062353129064,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 11633,
            "subtotal_m2": 0,
            "subtotal_usd": 17033.11
          }
        ],
        "mat_generales": [
          {
            "id": "5d595aca-d6f7-40c8-b764-e601ef8ec2a0",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 252.52,
            "obs": "Importado desde histórico",
            "subtotal_usd": 252.52
          }
        ],
        "mo_fabricacion": [
          {
            "id": "1f241370-b935-4650-8bba-739c3624ce7d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 561,
            "usd_hora": 36.26,
            "subtotal_usd": 20339.68
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "fed45baf-6595-4d6e-a5b2-b02c0070283a",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1272.12,
            "subtotal_usd": 1272.12,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "80fe2af9-1515-4812-8d44-e5e28c32224b",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 381.16,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 381.16
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "f30407a2-25b7-4c2f-bb1d-91fa81c6b523",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3715,
            "kg": 11633,
            "subtotal_usd": 4321.41,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "6cf49c78-5ce6-4567-90d8-a4e47c00529d",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "67fa7acc-3218-41c4-a526-7b6c50a69f35",
    "nro": "H-4442",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Consorcio Puerto",
    "contacto": "",
    "obra": "",
    "detalle": "Se presupuestaron 47,400kg - 3,27USD/kg y pesó 48,529kg [Desp: 4.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-05-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "79fd1a06-8374-4417-b9b2-1910b460f563",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f2eeb93c-b79b-4e27-8d2e-c97af5dae1af",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 48564,
            "area_pieza_m2": 0,
            "usd_kg": 0.9827095833680698,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 48564,
            "subtotal_m2": 0,
            "subtotal_usd": 47724.31
          }
        ],
        "mat_generales": [
          {
            "id": "11ee8b64-0c3f-4053-aa8f-5bb540e9ab8f",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 20666.4,
            "obs": "Importado desde histórico",
            "subtotal_usd": 20666.4
          }
        ],
        "mo_fabricacion": [
          {
            "id": "b3848f5b-7024-421e-8f4d-a1d1082f3bfd",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 2457,
            "usd_hora": 29.04,
            "subtotal_usd": 71343.05
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "b034251e-74a7-4b83-936e-bc4abad17b53",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 6894.03,
            "subtotal_usd": 6894.03,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "cfb04a9f-700c-4f23-a401-e51c81cb594e",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 989.35,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 989.35
          }
        ],
        "corte_pantografo": [
          {
            "id": "05e89111-20b4-4170-818e-05c2ae538d0a",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.152,
            "kg": 48564,
            "subtotal_usd": 7380.86,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e9f3968a-3a16-45cc-bde6-470bc0e810bc",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "31ce31f1-20ea-4622-81c8-cbe6ce33bf84",
    "nro": "H-4468",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Consorcio Puerto",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura auxiliar para arriostramiento\nde pilotes. Se realizaron horas extras y nocturnas [Desp: 24.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-06-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "88184341-501b-45d0-9270-a75923ca5449",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f016c963-a4fd-4d96-9694-cf6667e3897b",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 11633,
            "area_pieza_m2": 0,
            "usd_kg": 1.4349713380114915,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 11633,
            "subtotal_m2": 0,
            "subtotal_usd": 16693.02
          }
        ],
        "mat_generales": [
          {
            "id": "8269de9d-ddce-4700-a9f9-285ace881c48",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 246.52,
            "obs": "Importado desde histórico",
            "subtotal_usd": 246.52
          }
        ],
        "mo_fabricacion": [
          {
            "id": "9e783832-f305-4452-b089-b5a24384122e",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 636,
            "usd_hora": 30.13,
            "subtotal_usd": 19162.64
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "a8dae7ab-e31d-4ea8-b09f-b5a2458e9ba8",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 743.97,
            "subtotal_usd": 743.97,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "8ebf7f91-e010-4993-b6eb-61ab6888aebf",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 369.78,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 369.78
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "6ddcb695-c734-41d7-9dd5-c7435b9f9eb4",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3614,
            "kg": 11633,
            "subtotal_usd": 4204.07,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ebc0a244-c8a3-4f32-88e1-2ab5791ed813",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "cc8bb9b7-a121-4dce-8c12-42d15b5299db",
    "nro": "H-4604",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Consorcio Puerto",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura del Gabarito sin Pile Caps. Se cobraron 8,900 USD en horas adicionales (180 horas) [Desp: 14.6%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-10-22",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "5c78ca67-89b0-4023-8e3e-4b267eb7fbc0",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b9fd2185-c391-4eda-9b36-5e2c17e4320e",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 23482.56,
            "area_pieza_m2": 0,
            "usd_kg": 1.2768308307406269,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 23482.56,
            "subtotal_m2": 0,
            "subtotal_usd": 29983.26
          }
        ],
        "mat_generales": [
          {
            "id": "431308c1-471b-435a-ac51-5e2ab3a6e1c7",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1229.07,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1229.07
          }
        ],
        "mo_fabricacion": [
          {
            "id": "19d9c828-57a5-4121-9e8f-10f0d1930e41",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1306,
            "usd_hora": 26.53,
            "subtotal_usd": 34649.17
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "61d41c7b-cadd-44db-816a-93b9fff8ed76",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1722.22,
            "subtotal_usd": 1722.22,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "31629f2a-88fe-4922-8d84-4a38d43cdc21",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2094,
            "kg": 23482.56,
            "subtotal_usd": 4916.28,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f6b26918-feda-4a49-8436-904e5ce171e1",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "12d841b3-251b-491c-99b2-bb9d00e3a81a",
    "nro": "H-4691",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "JCDecaux",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura soporte de pantalla, dimensiones generales: 4,73 x 1.20 x 3.78 mts. [Desp: 30.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "dc0de8de-f0b2-4cc4-b167-d51b1bb988b5",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d6751cf9-9517-41d8-98b6-dafe8917ecfe",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2182,
            "area_pieza_m2": 0,
            "usd_kg": 1.5675365006500372,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2182,
            "subtotal_m2": 0,
            "subtotal_usd": 3420.36
          }
        ],
        "mat_generales": [
          {
            "id": "d2f63afa-1a5f-4078-990d-6dc301de7196",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 395.04,
            "obs": "Importado desde histórico",
            "subtotal_usd": 395.04
          }
        ],
        "mo_fabricacion": [
          {
            "id": "70c57281-91a7-4b3a-8ccd-ec73ecd73c71",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 251,
            "usd_hora": 21.32,
            "subtotal_usd": 5350.57
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "501c3019-7332-4f98-b96b-ca63c0cd2908",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1465.16,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1465.16
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "355c5bdb-aa82-4423-aebe-0acb827f4a73",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5013,
            "kg": 2182,
            "subtotal_usd": 1093.87,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "24397c8d-2ee0-48b5-acfa-7cfd6e5a275b",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "3edbe915-0e7a-437c-8649-7170425f61e8",
    "nro": "H-4750",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Señales",
    "contacto": "",
    "obra": "",
    "detalle": "2 Bastidores para montaje de pantallas led. Dimensiones generales: 12 x 3.6 mts. Incluye plataformas [Desp: 17.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-03-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "6e77a06d-b3ba-4614-bdfc-f8bca86a1b8e",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "22973b02-cc12-4ea6-bd78-def7e66a46d7",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5709,
            "area_pieza_m2": 0,
            "usd_kg": 1.2015828364351233,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5709,
            "subtotal_m2": 0,
            "subtotal_usd": 6859.84
          }
        ],
        "mat_generales": [
          {
            "id": "df893502-f72d-4c10-ae94-cf9e0e021459",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 979.62,
            "obs": "Importado desde histórico",
            "subtotal_usd": 979.62
          }
        ],
        "mo_fabricacion": [
          {
            "id": "6e44056a-33ca-4265-9e0e-2fa1548f42f1",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 555,
            "usd_hora": 19.32,
            "subtotal_usd": 10723.76
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "26c56660-3bfa-4078-ac3f-3f0e486d6f98",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 3690.32,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 3690.32
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "f4a078e7-c15a-4f21-abb9-6b40a34019a4",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.404,
            "kg": 5709,
            "subtotal_usd": 2306.45,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8eaa1ab3-6744-4297-adde-7216b4d894f2",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "312fdf87-9c38-4312-be89-7fba8f822eab",
    "nro": "H-4758",
    "nombre": "Industriales-Maritimas-Porticos",
    "cliente": "Ingener",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura de dimensiones generales 6780x3610x3800mm para abulonar\n   en obra. 6 Perfiles con platinas [Desp: 18.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-03-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "1a727c74-8781-43ab-9c7e-61698c6d54e9",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ba17baa0-6afb-4b7b-80ff-02dbb9ee7e8b",
            "nombre": "Industriales-Maritimas-Porticos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1005,
            "area_pieza_m2": 0,
            "usd_kg": 1.5572978197830525,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1005,
            "subtotal_m2": 0,
            "subtotal_usd": 1565.08
          }
        ],
        "mat_generales": [
          {
            "id": "dfed6139-7cdc-42e3-ab36-d3f45cb42f49",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 75.68,
            "obs": "Importado desde histórico",
            "subtotal_usd": 75.68
          }
        ],
        "mo_fabricacion": [
          {
            "id": "3536cb04-a838-4ec6-83b6-7442c424024f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 86,
            "usd_hora": 17.95,
            "subtotal_usd": 1543.59
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "7106a227-5b15-4304-9d48-354a95f4113d",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 755.45,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 755.45
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "b3276081-6dfa-4b5a-9984-24f77bae65a7",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4082,
            "kg": 1005,
            "subtotal_usd": 410.19,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f066f2d3-828c-469b-9d81-cba52a99785a",
    "created_at": "2026-07-31T21:50:37.778808Z",
    "updated_at": "2026-07-31T21:50:37.778808Z"
  },
  {
    "id": "47e2c852-908e-422d-94c7-f740756e26a9",
    "nro": "H-3549",
    "nombre": "Marcos",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Varias Dimensiones",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-02-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7b40757c-06e5-46eb-8f30-5206509697d8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "01b97c38-6563-49fc-bec8-1a9c92089bfc",
            "nombre": "Marcos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1139,
            "area_pieza_m2": 0,
            "usd_kg": 1.4986139250665997,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1139,
            "subtotal_m2": 0,
            "subtotal_usd": 1706.92
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "6fd9961e-6170-4b38-9858-eb5f6dc6688c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 136,
            "usd_hora": 18.83,
            "subtotal_usd": 2561.08
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "0e1b9295-df90-4081-b260-758a1b025875",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 152.21,
            "subtotal_usd": 152.21,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "11e86b6f-8b1d-4caa-aeeb-b597e1445654",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1180.81,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1180.81
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "01dfc54b-27dd-43ea-8209-4a82edfba4d6",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 1.0263,
            "kg": 1139,
            "subtotal_usd": 1168.99,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "427aa3c2-7e19-41d5-9063-263f338a7db0",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "6404d30f-83ac-4908-9e2e-94869a57b1c1",
    "nro": "H-3551",
    "nombre": "Marcos",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Se plegaron ángulos en Minstar",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-02-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "a14297e0-1485-490f-a036-e9287b5c05ee",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "da8825e7-816d-48a4-9910-ec9f6d038067",
            "nombre": "Marcos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2400,
            "area_pieza_m2": 0,
            "usd_kg": 1.778485127261576,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2400,
            "subtotal_m2": 0,
            "subtotal_usd": 4268.36
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "c616467c-2dd0-464d-aa42-75fe2baf48d3",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 101,
            "usd_hora": 26.72,
            "subtotal_usd": 2698.61
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "a7de1af3-976b-4da5-9b00-17c59a59fc08",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1300,
            "subtotal_usd": 1300,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "1de10eca-f04f-431f-a0c7-be4db896c2b5",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2159.12,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2159.12
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "4b062f26-95a6-4c9b-be47-cd135fda411b",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2758,
            "kg": 2400,
            "subtotal_usd": 661.9,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2b4c0d10-52a8-49c5-bbfa-9414755467ae",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "eaf26c44-c6f9-4959-ac0e-0f6b6a53ea6b",
    "nro": "H-3136",
    "nombre": "Mesas Industriales",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Mesa Metálica para molde de vigueta 10m y 8.6m por 0.71m + 1 Mano de Fondo + Piso Técnico",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-03-04",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ef10131b-900c-4962-879b-b4bec21c6526",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b75f33fc-ecbc-4044-ab96-814a86cf55b7",
            "nombre": "Mesas Industriales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1056,
            "area_pieza_m2": 0,
            "usd_kg": 1.6614480720517875,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1056,
            "subtotal_m2": 0,
            "subtotal_usd": 1754.49
          }
        ],
        "mat_generales": [
          {
            "id": "183ff5b4-ea3c-4a1b-aad9-c1e268c8d7d5",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 195.98,
            "obs": "Importado desde histórico",
            "subtotal_usd": 195.98
          }
        ],
        "mo_fabricacion": [
          {
            "id": "ba2f2d43-6148-4c35-aeec-036161c1722e",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 160,
            "usd_hora": 14.37,
            "subtotal_usd": 2299.23
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "6a4804cf-1584-4a11-a7cd-8a1cef75381b",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 54.33,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 54.33
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "430c6b0b-5f7a-4591-9a10-1b9e63291404",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1856,
            "kg": 1056,
            "subtotal_usd": 195.98,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "68cf1b1e-af85-4127-8629-ee8d2bc1dea2",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "363d956b-a127-4f6a-a9ca-d6d0ec69c530",
    "nro": "H-3165",
    "nombre": "Mesas Industriales",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Mesa Metálica para molde de vigueta 8600 x 710mm + 1 Mando de Fondo + Piso técnico",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-04-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "3a0a7d2d-dd49-428e-a810-ab6419faf4e1",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b04056df-a38e-44c2-9f1e-c9d213b32d2c",
            "nombre": "Mesas Industriales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 580,
            "area_pieza_m2": 0,
            "usd_kg": 1.4266050724511263,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 580,
            "subtotal_m2": 0,
            "subtotal_usd": 827.43
          }
        ],
        "mat_generales": [
          {
            "id": "581ee7dd-2079-453b-b1dd-fad2b12d848c",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 146.72,
            "obs": "Importado desde histórico",
            "subtotal_usd": 146.72
          }
        ],
        "mo_fabricacion": [
          {
            "id": "bbe65274-612d-4194-8ce3-5b36abc9f3b6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 79,
            "usd_hora": 15.67,
            "subtotal_usd": 1238.24
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "bf6c1099-2da2-4b93-8ec4-17a4eba2565d",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 47.05,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 47.05
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "5e610fcb-1d5a-4444-b9f6-18a712bc3886",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4148,
            "kg": 580,
            "subtotal_usd": 240.56,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2cb41637-72c3-44d3-b363-5fe19bb34234",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "2977950f-ec4b-4571-9722-ed9a3e245e9e",
    "nro": "H-3440",
    "nombre": "Mesas Industriales",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Mesa Soporte de dimensiones aproximadas 2540 x 3480 x 867mm\n1 mano de Intergard 269 - 2 manos de Interthane 990 (Gris Grafito)",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-11-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "73132ec7-b163-4454-a247-13c664473b6e",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e8cb5eec-527d-4279-8c87-463319317a6d",
            "nombre": "Mesas Industriales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 689,
            "area_pieza_m2": 0,
            "usd_kg": 3.2543526402461698,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 689,
            "subtotal_m2": 0,
            "subtotal_usd": 2242.25
          }
        ],
        "mat_generales": [
          {
            "id": "a357756e-f6dd-440e-999e-51f6fe687450",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 161.02,
            "obs": "Importado desde histórico",
            "subtotal_usd": 161.02
          }
        ],
        "mo_fabricacion": [
          {
            "id": "700083c0-dc8f-4439-82d6-42e1d9c607a4",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 62.5,
            "usd_hora": 24.57,
            "subtotal_usd": 1535.89
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "c4dac8a8-e775-478e-9478-d8f7a856654e",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 161.02,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 161.02
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "7de050a9-c4ce-4029-855a-dd8899a41a08",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.29,
            "kg": 689,
            "subtotal_usd": 199.83,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "140357f5-8378-46e2-a7bd-999d1dfd7430",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "09a84cd1-fe04-40a7-9f4e-d64d6d7a1569",
    "nro": "H-3602",
    "nombre": "Mesas Industriales",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Mesas abulonadas fabricadas de piezas plegadas y angulos\n17 h pintando - 1,5h/un y 25min/m2",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-03-30",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "32a15e14-1799-4dfc-84e4-e185f8f54059",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a4628af1-6d30-4cb0-b8c4-0d928ce88398",
            "nombre": "Mesas Industriales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 245,
            "area_pieza_m2": 0,
            "usd_kg": 6.122448979591836,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 245,
            "subtotal_m2": 0,
            "subtotal_usd": 1500
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "4771541a-acaa-492a-82fb-9ea55b08e94f",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "5b451c44-01ad-499d-aa64-9ee1172bfdaa",
    "nro": "H-3753",
    "nombre": "Mesas Industriales",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Mesas soldadas fabricadas de tubulares y planchas 1/4\" con osogrill. Se hizo un cambio de plancha de 1/2\" a 1/4\" pasamos de 190kg/un y 5USD/KG",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-08-12",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "dd0f17d2-76ca-4ca4-88de-04d60ca95b82",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "549b2e14-ef3d-4843-8cbb-aee09cf77fc9",
            "nombre": "Mesas Industriales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 580,
            "area_pieza_m2": 0,
            "usd_kg": 2.749243617374005,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 580,
            "subtotal_m2": 0,
            "subtotal_usd": 1594.56
          }
        ],
        "mat_generales": [
          {
            "id": "20e5ccea-a643-480f-8f12-f3d1b51fe509",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 592.52,
            "obs": "Importado desde histórico",
            "subtotal_usd": 592.52
          }
        ],
        "mo_fabricacion": [
          {
            "id": "609ac57f-1e0b-4898-8f5f-3ecdda34f8b5",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 57,
            "usd_hora": 26.6,
            "subtotal_usd": 1516.32
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "3cd4c85d-0665-4b14-98c4-76de349e4716",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 261.24,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 261.24
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "348f14f4-ce89-4d3e-8154-16f3c71636ce",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4058,
            "kg": 580,
            "subtotal_usd": 235.37,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e28fb2f7-fd2b-4520-8312-1d37cb5fbd61",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "ffc19d7d-c30a-4a94-83d1-4e5c252a3215",
    "nro": "H-3811",
    "nombre": "Mesas Industriales",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Soporte para tanque de agua de dimensiones generales 1080x2190x800mm.\n2 manos de Cromox - 3 manos de esmalte sintético (gris)",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-09-28",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "d82f757b-be85-4d30-b2bd-bd463a7e3efb",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "98fd8270-1eee-4a08-8a8c-819e1dbd09cd",
            "nombre": "Mesas Industriales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 312,
            "area_pieza_m2": 0,
            "usd_kg": 1.9295911438182018,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 312,
            "subtotal_m2": 0,
            "subtotal_usd": 602.03
          }
        ],
        "mat_generales": [
          {
            "id": "23d167cf-9d23-42be-9b76-2e3274b103ae",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 19.27,
            "obs": "Importado desde histórico",
            "subtotal_usd": 19.27
          }
        ],
        "mo_fabricacion": [
          {
            "id": "5a754f01-ee71-47ee-9f04-4d99b8fbbf6d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 41.5,
            "usd_hora": 24.46,
            "subtotal_usd": 1015.18
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "6a05d19c-27b4-4a40-b8b9-27df681bb59a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 237.04,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 237.04
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "121bdee7-82df-4420-b223-78064583c60d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5336,
            "kg": 312,
            "subtotal_usd": 166.48,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "025cf9e4-94a3-4639-8512-aa80a876df13",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "558a5876-9fce-4752-8fdb-9dca13e17aab",
    "nro": "H--",
    "nombre": "Mesas Industriales",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-11-17",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "bc2346ab-f37b-453c-831d-12dc29e28141",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "cf7388de-2540-402d-8401-edf7f752ebdc",
            "nombre": "Mesas Industriales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 647,
            "area_pieza_m2": 0,
            "usd_kg": 1.8281121087216197,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 647,
            "subtotal_m2": 0,
            "subtotal_usd": 1182.79
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "0b34864d-39fc-49b1-ada5-61b05e5e93b6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 85,
            "usd_hora": 21.66,
            "subtotal_usd": 1840.68
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "8732edd4-eb7c-4935-b076-e884cb6a2368",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 741.84,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 741.84
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "cc43719a-4d0c-425f-8f01-167c4b9ea022",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 209.86,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 209.86
          }
        ],
        "corte_pantografo": [
          {
            "id": "3f3114a7-2a77-43f8-ab9b-9c0a63a33b54",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5948,
            "kg": 647,
            "subtotal_usd": 384.83,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "cafdbf95-9eac-40d6-8530-81424529c928",
    "created_at": "2026-07-31T21:50:37.780850Z",
    "updated_at": "2026-07-31T21:50:37.780850Z"
  },
  {
    "id": "09537085-f88b-454c-a5d3-30d4ec98f972",
    "nro": "H-4208",
    "nombre": "Moldes",
    "cliente": "Gonzalez Conde",
    "contacto": "",
    "obra": "",
    "detalle": "Envolvente e=1/8\" y costillas 50mm e=5/32\" @500mm aprox - 3 Piezas por molde ajustables [Desp: 35.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-09-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2f24cb03-5926-467c-b97c-5f3a5c21013a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a573befd-38c1-44a1-8ef0-94ad75284f6b",
            "nombre": "Moldes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1415,
            "area_pieza_m2": 0,
            "usd_kg": 1.674511060045317,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1415,
            "subtotal_m2": 0,
            "subtotal_usd": 2369.43
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "3e6ceac2-ab5c-4831-a8a2-278e4671be27",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 92,
            "usd_hora": 34.76,
            "subtotal_usd": 3198.18
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "d80014be-f406-4e58-b6c2-118903298354",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 118.39,
            "subtotal_usd": 118.39,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "ef497670-183e-4ca9-b4a9-3aef027b7f86",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6459,
            "kg": 1415,
            "subtotal_usd": 913.99,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "962d1933-f7de-448b-acf5-bbd1e7ad9405",
    "created_at": "2026-07-31T21:50:37.781846Z",
    "updated_at": "2026-07-31T21:50:37.781846Z"
  },
  {
    "id": "5afc0cfa-ba0a-4036-9cb0-85ff3b21ffbd",
    "nro": "H-4655",
    "nombre": "Moldes",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Envolvente e=5/32\" y costillas 75mm e=1/4\"\" @475mm aprox. Verticales en tubular 50x50x3,2mm.  [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-11-27",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2c1affa6-4451-4b49-a0cc-7d76769d34d4",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "8a88b7fe-ab78-430d-9a64-e3a68f0a20ac",
            "nombre": "Moldes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 500,
            "area_pieza_m2": 0,
            "usd_kg": 1.308163977322285,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 500,
            "subtotal_m2": 0,
            "subtotal_usd": 654.08
          }
        ],
        "mat_generales": [
          {
            "id": "5fb0fa27-fd50-4989-bfd0-28fd641d4ac6",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 272.48,
            "obs": "Importado desde histórico",
            "subtotal_usd": 272.48
          }
        ],
        "mo_fabricacion": [
          {
            "id": "0f53a4e3-3eab-400f-ba06-8c3e4a037d4f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 19,
            "usd_hora": 81.49,
            "subtotal_usd": 1548.22
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "91897759-ab2a-4433-b56c-e41c0d4e7b66",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 32.73,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 32.73
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "3ad8f7e2-3d3e-43df-8293-a2980d7103f1",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.545,
            "kg": 500,
            "subtotal_usd": 272.48,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e4ffc620-ec1b-4a49-bcda-d75f39620866",
    "created_at": "2026-07-31T21:50:37.781846Z",
    "updated_at": "2026-07-31T21:50:37.781846Z"
  },
  {
    "id": "7f8f6773-85ee-4dca-9f49-61bed5dfee15",
    "nro": "H-4692",
    "nombre": "Moldes",
    "cliente": "Hopresa",
    "contacto": "",
    "obra": "",
    "detalle": "Molde para losetas con laterales rebatibles y tapas interiores para llenar losetas de diferentes dimensiones.  [Desp: 1800.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "95a25f1c-64c5-4011-9063-f32a1611564e",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1a0ed46f-2ef4-4aff-acf3-26dca242cdc6",
            "nombre": "Moldes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 465,
            "area_pieza_m2": 0,
            "usd_kg": 1.3760665972944852,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 465,
            "subtotal_m2": 0,
            "subtotal_usd": 639.87
          }
        ],
        "mat_generales": [
          {
            "id": "ea6e1f41-77ee-4b32-916f-4333420ebbe6",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 159.97,
            "obs": "Importado desde histórico",
            "subtotal_usd": 159.97
          }
        ],
        "mo_fabricacion": [
          {
            "id": "08d2cf97-d1bf-4f08-b36d-f66e145f3512",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 99.25,
            "usd_hora": 18.64,
            "subtotal_usd": 1850.08
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "4796af6f-ca19-4423-8774-a195a544bb54",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 29.94,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 29.94
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "a6f71004-b5a0-4a93-9622-fc51261bea07",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4734,
            "kg": 465,
            "subtotal_usd": 220.15,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "4144f018-4d78-4824-86cb-36ec8407c4b8",
    "created_at": "2026-07-31T21:50:37.781846Z",
    "updated_at": "2026-07-31T21:50:37.781846Z"
  },
  {
    "id": "91a9054f-41aa-4dfb-ad7d-9a8c77f4c941",
    "nro": "H-4704",
    "nombre": "Moldes",
    "cliente": "Hopresa",
    "contacto": "",
    "obra": "",
    "detalle": "Moldes para Vigas de Medida Variable (2 Medidas). Incluye juego de Tapas (6 medidas) [Desp: 2700.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "66518dac-79df-41ff-b486-ca20f7afc220",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "83065421-85c7-4d86-8012-3280477a5a8a",
            "nombre": "Moldes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4476,
            "area_pieza_m2": 0,
            "usd_kg": 1.3849938573823368,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4476,
            "subtotal_m2": 0,
            "subtotal_usd": 6199.23
          }
        ],
        "mat_generales": [
          {
            "id": "36c6e229-55b7-4de4-8303-ff1c7d6b7dc6",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1148.48,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1148.48
          }
        ],
        "mo_fabricacion": [
          {
            "id": "8e521531-e3f2-4983-8889-b14b7b189b5e",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 527,
            "usd_hora": 21.7,
            "subtotal_usd": 11435.71
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "9df9fadc-9681-4092-b32d-93185a431fa8",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 230.55,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 230.55
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "6f2d800c-6655-4545-81db-5ed2baa65539",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4001,
            "kg": 4476,
            "subtotal_usd": 1791.03,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "c8ed224b-d1cd-47d0-acd3-4d38fb88bb0b",
    "created_at": "2026-07-31T21:50:37.781846Z",
    "updated_at": "2026-07-31T21:50:37.781846Z"
  },
  {
    "id": "24072497-48cb-4abf-ab03-b95609b06a18",
    "nro": "H-4720",
    "nombre": "Moldes",
    "cliente": "Schmidt",
    "contacto": "",
    "obra": "",
    "detalle": "14 Mesas de premoldeado de 1180 x 6000mm. Sin materiales [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-31",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "290cf034-1ac4-4a9d-baa3-cec1f0618ef0",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "bd397e0f-471e-4231-a331-b9303fe532ac",
            "nombre": "Moldes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 16609,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 16609,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "c03db89e-f16d-4f4e-9a2b-cb6b8f60eaa3",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 737,
            "usd_hora": 28.07,
            "subtotal_usd": 20690.42
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "3cd9dde6-30d2-4ed2-9ee5-85ed3d55f83f",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 847.99,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 847.99
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "7ffd7162-394c-489c-9c96-02d42c0cbcd9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3267,
            "kg": 16609,
            "subtotal_usd": 5426.59,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a21e60df-4206-48a6-b9cf-8c2cdb700f95",
    "created_at": "2026-07-31T21:50:37.781846Z",
    "updated_at": "2026-07-31T21:50:37.781846Z"
  },
  {
    "id": "6cbf9295-57aa-4c73-9ef3-2111f1a4d9a9",
    "nro": "H-4734",
    "nombre": "Moldes",
    "cliente": "Gonzalez Conde",
    "contacto": "",
    "obra": "",
    "detalle": "Envolvente 1/8\" y costillas 50mm e=1/8\" @750mm aprox. Moldes laterales para vaciado de vigas. [Desp: 15.4%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-02-19",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "4e4a3ace-ed81-4269-8042-ba651d150131",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "bd9517ef-868e-427c-a812-68a92dc98aa6",
            "nombre": "Moldes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 292,
            "area_pieza_m2": 0,
            "usd_kg": 1.1425073956951954,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 292,
            "subtotal_m2": 0,
            "subtotal_usd": 333.61
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "f1a02984-0f49-4f93-bc47-2237a83953fc",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 23,
            "usd_hora": 38.34,
            "subtotal_usd": 881.73
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "26dc90e2-0d64-4fc0-8b50-2ac09f26dfb6",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 35.7,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 35.7
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "70f78cf9-a2d8-45bc-9c33-3fbe2f4de203",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5101,
            "kg": 292,
            "subtotal_usd": 148.95,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "df669746-a73f-48da-b84e-d770353267d4",
    "created_at": "2026-07-31T21:50:37.781846Z",
    "updated_at": "2026-07-31T21:50:37.781846Z"
  },
  {
    "id": "fed03c3e-99e8-44b4-9269-db501b9febf4",
    "nro": "H-3663",
    "nombre": "Moldes Circulares",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "8 de 800mm - 8 de 500mm Ø800 (632 USD/m)\n4 de 1000mm - 4 de 500mm Ø1000 (798 USD/m)\nEnv 1/8\" - Cost 1/4\" [Desp: 3200.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-05-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "e016b044-071a-4cd7-8af5-4776a0cae748",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "577fcf11-b95a-4eab-a5a2-02b19971d3c9",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2809,
            "area_pieza_m2": 0,
            "usd_kg": 2.0322938784588613,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2809,
            "subtotal_m2": 0,
            "subtotal_usd": 5708.71
          }
        ],
        "mat_generales": [
          {
            "id": "88cd91b0-4963-4795-840c-bce051ea274d",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 232.05,
            "obs": "Importado desde histórico",
            "subtotal_usd": 232.05
          }
        ],
        "mo_fabricacion": [
          {
            "id": "6d301a44-259a-426f-8903-724c24d2c719",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 238,
            "usd_hora": 17.41,
            "subtotal_usd": 4144.12
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "4de8e2f1-7574-480a-aed9-cf11374acac2",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 145.33,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 145.33
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "407d4e09-a334-494b-a49a-8d4e9c58992f",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4022,
            "kg": 2809,
            "subtotal_usd": 1129.79,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ea433d7b-5a45-4b02-99da-d3821828d7da",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "fc08791d-0b67-429e-9048-c465061d3eeb",
    "nro": "H-3671",
    "nombre": "Moldes Circulares",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "4 de 1500mm\nEnv 1/8\" - Cost 1/4\" 80mm [Desp: 3207.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-01",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "5dc1c794-bf2b-4462-8681-edcafe6fe590",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e6ba40b5-2da2-426e-9a48-fd72eaff0b9c",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1191,
            "area_pieza_m2": 0,
            "usd_kg": 2.190842816076243,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1191,
            "subtotal_m2": 0,
            "subtotal_usd": 2609.29
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "2d80a10c-d806-4faa-807c-e886c87cbddb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 65,
            "usd_hora": 26.51,
            "subtotal_usd": 1723.22
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "3587a2d2-640e-4984-8070-cb8af02879f7",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 60.63,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 60.63
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "24e6ae0f-618c-4a30-ba7d-f80e1f70db2d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5095,
            "kg": 1191,
            "subtotal_usd": 606.85,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "5327ee56-4d34-443f-b7d8-1bf9b7ef6f6e",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "bf333dbf-e14a-4360-87e5-0b41aca4d14d",
    "nro": "H-3694",
    "nombre": "Moldes Circulares",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "4 de 1000mm - 4 de 500mm\nEnv 1/8\" - Cost 1/4\" 80mm [Desp: 2280.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "9f5f8131-9186-43a1-afec-b8015c4f7964",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3f2132be-cfac-41f6-9f3d-76b37f2ba820",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1280,
            "area_pieza_m2": 0,
            "usd_kg": 1.9017269736842106,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1280,
            "subtotal_m2": 0,
            "subtotal_usd": 2434.21
          }
        ],
        "mat_generales": [
          {
            "id": "8b13cc9d-bfdc-4824-8620-ee478f075a7b",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 92,
            "obs": "Importado desde histórico",
            "subtotal_usd": 92
          }
        ],
        "mo_fabricacion": [
          {
            "id": "fdcc208a-adb9-4efe-b657-f4bd06886abe",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 115,
            "usd_hora": 15.22,
            "subtotal_usd": 1750.1
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "ed98bda6-5d2c-4957-80b4-c944967bc83a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 79.15,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 79.15
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c0005af6-1cc7-4671-ae6a-1cf51183089d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5035,
            "kg": 1280,
            "subtotal_usd": 644.53,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9722d911-17c5-435d-8219-aef93c227502",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "180a4969-2673-4721-a0ef-396d49ebc8d5",
    "nro": "H-3812",
    "nombre": "Moldes Circulares",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "2 de 3000mm [Desp: 2660.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-09-29",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8ea44236-310c-4df6-8107-834f0a04234d",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "5038a1ab-788d-4fc7-9244-1e9e0edbb3e3",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5590,
            "area_pieza_m2": 0,
            "usd_kg": 1.9849744050820288,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5590,
            "subtotal_m2": 0,
            "subtotal_usd": 11096.01
          }
        ],
        "mat_generales": [
          {
            "id": "5055597f-ab71-444f-9b9b-4a1f2973ed2d",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 65.43,
            "obs": "Importado desde histórico",
            "subtotal_usd": 65.43
          }
        ],
        "mo_fabricacion": [
          {
            "id": "2183705b-1111-4253-9623-f514f474fcfb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 217,
            "usd_hora": 19.92,
            "subtotal_usd": 4322.89
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "cdeaee73-43b5-44ca-96a7-4ea382f5a756",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1290.55,
            "subtotal_usd": 1290.55,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "0f158ab5-cdfe-44a9-99b0-ea068de639ad",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 194.03,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 194.03
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "8bf09b54-9ec6-470d-b0aa-473168ab8284",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4617,
            "kg": 5590,
            "subtotal_usd": 2581.1,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "c4003d1e-bc53-4d47-9ddd-aa84525cf240",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "7cb9a18a-3868-4895-8528-71d735a2d3d4",
    "nro": "H-3824",
    "nombre": "Moldes Circulares",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "4  de 1500mm\n Env 5/32\" - Cost 1/4\" [Desp: 1855.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-10-12",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "4be93e07-32f5-4b5f-9302-77aec8e4f0f5",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ea90a8af-96b4-4c4a-83d9-65b9b17a2297",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1516,
            "area_pieza_m2": 0,
            "usd_kg": 1.8411454291479123,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1516,
            "subtotal_m2": 0,
            "subtotal_usd": 2791.18
          }
        ],
        "mat_generales": [
          {
            "id": "3e17008e-d338-4e79-9257-7b70682b0387",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 314.11,
            "obs": "Importado desde histórico",
            "subtotal_usd": 314.11
          }
        ],
        "mo_fabricacion": [
          {
            "id": "7003226d-c875-43a1-aba8-bd5136c5da37",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 144,
            "usd_hora": 22.93,
            "subtotal_usd": 3302.49
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "2922d092-e785-4eae-81ef-d171294b2e1a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 82.7,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 82.7
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "01f25993-6926-4943-8aee-e305336ba558",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.534,
            "kg": 1516,
            "subtotal_usd": 809.52,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "44efc2f5-6eca-48f7-8de8-8318276d3907",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "59c5ece2-a060-4014-ba2c-c24fe3ff1f5b",
    "nro": "H-3835",
    "nombre": "Moldes Circulares",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "8 de 2000mm \nEnv 1/8\" - Cost 1/4\" 60mm [Desp: 3529.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-10-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "f5cf9699-29a2-44c4-86e7-b66550f30c69",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a73cf59c-8ffc-4bb2-bb80-001b0e27b96f",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1910,
            "area_pieza_m2": 0,
            "usd_kg": 1.9792499759519593,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1910,
            "subtotal_m2": 0,
            "subtotal_usd": 3780.37
          }
        ],
        "mat_generales": [
          {
            "id": "c346fccf-7db2-4be6-bebc-bb62a0b937d8",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 522.27,
            "obs": "Importado desde histórico",
            "subtotal_usd": 522.27
          }
        ],
        "mo_fabricacion": [
          {
            "id": "a14a4339-8da6-438b-b775-526aef43d8ed",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 160,
            "usd_hora": 20.36,
            "subtotal_usd": 3258.09
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "8ef09970-9cd0-4ba8-9532-adca82352b70",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 271.43,
            "subtotal_usd": 271.43,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "30ee77b2-a871-403f-84aa-7451897216a4",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 83.29,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 83.29
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "401b26bf-fcc8-4ea5-9fb4-95c4a945dcaa",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5469,
            "kg": 1910,
            "subtotal_usd": 1044.55,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "c2fa3493-c62e-4e42-8045-26725719cc79",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "73f5ca08-61a0-4e87-8019-9a8575e60eb6",
    "nro": "H-3887",
    "nombre": "Moldes Circulares",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "12 de 500mm\nEnv 1/8\" - Cost 5/32\" 60mm (55kg/un) [Desp: 3984.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-12-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "c6cd8f9e-d244-42d6-a2d5-1ed922567088",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b7fb82b7-e469-44fc-919f-3cdaa36bd4f2",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 774,
            "area_pieza_m2": 0,
            "usd_kg": 2.1606660157076245,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 774,
            "subtotal_m2": 0,
            "subtotal_usd": 1672.36
          }
        ],
        "mat_generales": [
          {
            "id": "5b3a84df-e8ea-4e17-bd22-625cc6235001",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 396.63,
            "obs": "Importado desde histórico",
            "subtotal_usd": 396.63
          }
        ],
        "mo_fabricacion": [
          {
            "id": "ae66ba8c-40e0-4f4c-a3ef-99916536d549",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 99,
            "usd_hora": 16.81,
            "subtotal_usd": 1663.72
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "16ba5410-01fe-4423-9278-25b17726c025",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 215.33,
            "subtotal_usd": 215.33,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "6e382017-450b-4128-a188-89cdbbe1bb8a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 60.43,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 60.43
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "68df4cd1-229c-4681-b49c-ade13f00d0c9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7126,
            "kg": 774,
            "subtotal_usd": 551.53,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f2a2dc2c-f76c-4833-bca9-6e570ea8c1e4",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "e853492b-638a-4fec-bfe6-b214584df87d",
    "nro": "H-3898",
    "nombre": "Moldes Circulares",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "6 de 700mm\nEnv 1/8\" - Cost 3/16\" 60mm - Cierre Ángulo 2 x 1/4\" [Desp: 4148.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-12-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "d29ca88e-ea49-4640-a06a-cbec65d6fcd2",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "eb868877-86a9-4f08-8da9-21cfb59c4800",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 950,
            "area_pieza_m2": 0,
            "usd_kg": 1.9800998297983763,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 950,
            "subtotal_m2": 0,
            "subtotal_usd": 1881.09
          }
        ],
        "mat_generales": [
          {
            "id": "f5bcc89a-ff44-4712-a2f1-b865a8fb6a7a",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 335.01,
            "obs": "Importado desde histórico",
            "subtotal_usd": 335.01
          }
        ],
        "mo_fabricacion": [
          {
            "id": "d9dfb2b3-4cdf-4066-886a-f2c6e7ac9421",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 88,
            "usd_hora": 27.42,
            "subtotal_usd": 2412.65
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "410e0c9d-0891-4ca9-b586-bb2e969d864b",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 127.86,
            "subtotal_usd": 127.86,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "8ef50ef7-1348-4581-9c11-e48ac5e6db68",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 118.37,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 118.37
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "72f6e11c-d485-45cc-a0e0-8dc41a297fd8",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.539,
            "kg": 950,
            "subtotal_usd": 512.01,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a25a00ca-87aa-4d19-9a1a-821400362a2e",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "1831b4a2-396c-4241-9cd1-33c9b09d8a2d",
    "nro": "H-3938",
    "nombre": "Moldes Circulares",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "6 de 700mm\nEnv 1/8\" - Cost 1/4\" 50mm @400 - Cierre Ángulo 2 x 1/4\" [Desp: 4142.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-02-03",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "0abe4a10-9b57-4e79-aa42-6b289b2f781a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "343cf2f6-5bd0-4c93-8575-80903d2dfbbd",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1736,
            "area_pieza_m2": 0,
            "usd_kg": 2.0813086271995003,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1736,
            "subtotal_m2": 0,
            "subtotal_usd": 3613.15
          }
        ],
        "mat_generales": [
          {
            "id": "9b53d5ec-e6a7-4ad0-91ac-2daca90a3132",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 980.41,
            "obs": "Importado desde histórico",
            "subtotal_usd": 980.41
          }
        ],
        "mo_fabricacion": [
          {
            "id": "12361a48-ce52-435e-bddf-2599c9db84f9",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 184,
            "usd_hora": 25.59,
            "subtotal_usd": 4708.34
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "7249f18e-2b94-4893-9220-22266034ad64",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 383.79,
            "subtotal_usd": 383.79,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "6fcea468-fb65-45fd-98ea-0f6311f4fe6f",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 114.78,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 114.78
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "b1da8f5f-e327-44f2-ae3c-219fa0170da3",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5758,
            "kg": 1736,
            "subtotal_usd": 999.54,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "7f3cad8e-acba-4607-b2d9-a9e1f2ee6db6",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "f20d51b5-aba3-4598-ae4d-ee91717f76de",
    "nro": "H-4081",
    "nombre": "Moldes Circulares",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "30 de 400mm\nEnv 1/8\" - Cost 5/32\" 60mm (47kg/un) [Desp: 4728.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "1faee9cf-c5f4-422c-92f3-37676f7bf5a1",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "608c9f12-daa2-40b0-8d99-498d74356b5b",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1352,
            "area_pieza_m2": 0,
            "usd_kg": 2.152138107728909,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1352,
            "subtotal_m2": 0,
            "subtotal_usd": 2909.69
          }
        ],
        "mat_generales": [
          {
            "id": "30042766-499c-4ff0-a0d5-85ab65272187",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 575.26,
            "obs": "Importado desde histórico",
            "subtotal_usd": 575.26
          }
        ],
        "mo_fabricacion": [
          {
            "id": "25c0a22e-08af-46fe-a30b-46d550f42f78",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 206,
            "usd_hora": 22.5,
            "subtotal_usd": 4634.23
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "9f81e07a-9b0a-4c74-9422-7d501f2cb46c",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 243.71,
            "subtotal_usd": 243.71,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "5941ee53-1a49-46ed-91ed-949cffa45494",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 122.47,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 122.47
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "353e5668-8b99-4cb5-b8a6-2959a657d87c",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.8244,
            "kg": 1352,
            "subtotal_usd": 1114.64,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8626e15f-e416-427e-9f04-455ced238bfd",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "d5713448-104b-445a-ba32-63fa82774af9",
    "nro": "H-4288",
    "nombre": "Moldes Circulares",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "20 de 500mm - 20 de 300mm\nEnv 1/8\" - Cost 5/32\" 60mm (46kg/un - Aprox) [Desp: 6408.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-11-22",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "a6b0ae5b-2380-4274-b242-4bcbd9f08744",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "05553296-0639-4e21-858c-57ffa767761d",
            "nombre": "Moldes Circulares",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1846,
            "area_pieza_m2": 0,
            "usd_kg": 1.8751294476655183,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1846,
            "subtotal_m2": 0,
            "subtotal_usd": 3461.49
          }
        ],
        "mat_generales": [
          {
            "id": "73ecb0c6-8d7a-491e-a922-ee3f442e74aa",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 654.88,
            "obs": "Importado desde histórico",
            "subtotal_usd": 654.88
          }
        ],
        "mo_fabricacion": [
          {
            "id": "e0f2a690-2db2-45f7-8476-d26edff46949",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 248,
            "usd_hora": 30.23,
            "subtotal_usd": 7496.37
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "e14efb50-1c88-4f2e-ac29-37ab614195e8",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 511.53,
            "subtotal_usd": 511.53,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "c59c549f-2055-431b-bf05-6726fc6cbb83",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 164.47,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 164.47
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "181850cb-ef06-44f0-bceb-555ff068fe10",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7103,
            "kg": 1846,
            "subtotal_usd": 1311.26,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8be7adf7-2188-4fca-9edc-70a37ec70579",
    "created_at": "2026-07-31T21:50:37.782853Z",
    "updated_at": "2026-07-31T21:50:37.782853Z"
  },
  {
    "id": "076e93bd-07a1-41ca-ac97-e8932bcd1c81",
    "nro": "H-13183",
    "nombre": "Montajes",
    "cliente": "Gomez Platero",
    "contacto": "",
    "obra": "",
    "detalle": "Escaleras en 3 Cruces",
    "tipo_trabajo": "Montaje",
    "fecha": "2021-04-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "bd473422-5338-4203-b02b-e1cef829bd21",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "80707f19-621f-4c68-a633-2f72d6bf4171",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 49520,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 49520,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [
          {
            "id": "ade89bd6-548c-42ad-85a1-acedf1424a14",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1986.4,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1986.4
          }
        ],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "de9d2672-e874-4f45-b883-fc6118c82b36",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 2251,
            "usd_hora": 17.63,
            "subtotal_usd": 39682.62
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "5dfb731e-771d-4f91-8509-fdc042f3d61b",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 33730.98,
            "subtotal_usd": 33730.98,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2eae1c9a-5bf5-45e8-81f9-13fa2a717781",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "982efd71-3adb-4a09-844c-5a5cf21aedbc",
    "nro": "H-14111",
    "nombre": "Montajes",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Techos de 30 metros de longitud y 7m de ancho aprox pintados",
    "tipo_trabajo": "Montaje",
    "fecha": "2023-07-03",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "77b34d22-4489-4f67-90b4-b31337024672",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "6c382080-37c0-438c-b54a-e30814b22620",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 13227,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 13227,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "5806e1b5-ad7a-497d-8c4f-4513ffdc6956",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 994,
            "usd_hora": 21.46,
            "subtotal_usd": 21331.28
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "6c9bc3e6-7311-4b67-90b4-28eacc98e946",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 13313.55,
            "subtotal_usd": 13313.55,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "1d32c19d-9442-44e8-9935-ee7cb5477ac0",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 545.16,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 545.16
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "c4f64c99-3824-46a2-b49a-e308dad8ebae",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 2718.01,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 2718.01
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "fe8f2249-a3e6-42da-b955-b30d448c409e",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "32d20fea-a858-4a70-b8ab-b7c336ff2897",
    "nro": "H-14176",
    "nombre": "Montajes",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Demasiadas Complicaciones en este trabajo",
    "tipo_trabajo": "Montaje",
    "fecha": "2023-08-28",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ae5abc99-0353-49ac-bf6e-1b9d7af539f0",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f97acfc5-6cdf-4560-b9ce-02d2f0939cda",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 43124,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 43124,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "6aecf750-310a-4c85-80aa-2b2b371a3a0b",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 3088,
            "usd_hora": 17.53,
            "subtotal_usd": 54126.82
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "4a433e0f-a212-49f8-9ab3-947581749251",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 24186.5,
            "subtotal_usd": 24186.5,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "cd43488d-dd42-44ec-8806-b764db6dddfc",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 9982.73,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 9982.73
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d4416b66-c866-468e-835a-305f52d6dd79",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "f3a5158a-10c6-474e-bdda-d240eec75561",
    "nro": "H-14229",
    "nombre": "Montajes",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Montaje de Escalera PANLC019",
    "tipo_trabajo": "Montaje",
    "fecha": "2023-10-05",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "6d7d052b-e56c-4315-ad98-c803c53e1b75",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1db8b499-ce1a-4279-bd64-0b5db75e73fe",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4069,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4069,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "2da38aa1-569f-4304-9819-f9a901d4b657",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 147,
            "usd_hora": 45.39,
            "subtotal_usd": 6672.33
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "28d64820-eacc-42f6-8ea7-a75a5edf4cd3",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 5573.9,
            "subtotal_usd": 5573.9,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "b67f57be-bae3-4624-944b-d1bb69f3f335",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 203.08,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 203.08
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "2970b16c-ecf8-4309-a6e5-2c33b6096706",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 325.7,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 325.7
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "035cbb4b-4934-4486-9df8-0a593a4d19b7",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "01fc59b8-fda5-494d-8a45-9e3b9f5258a9",
    "nro": "H-14364",
    "nombre": "Montajes",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Barandas a medida en las Piedras Galv Cal",
    "tipo_trabajo": "Montaje",
    "fecha": "2024-02-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "495611ff-5f0d-40db-9a8c-3aca6e55a7c7",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "552a17b7-0616-4fbf-8910-bba2e29d38e9",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 535,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 535,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "56e04c0b-9e48-41c3-b29a-7508add83fbd",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 91.5,
            "usd_hora": 32.05,
            "subtotal_usd": 2932.69
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "c93f73a8-d1e3-44c1-8929-ff2c3a06bd7d",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 427.98,
            "subtotal_usd": 427.98,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "ca89b7a1-22c9-4982-8199-b4140699ec8b",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 639.33,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 639.33
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "6a29a075-b9c1-4867-a9c0-0eccd2b1b205",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "07b3c6b7-d39b-4b6b-adb9-5b2465a66e37",
    "nro": "H-14469",
    "nombre": "Montajes",
    "cliente": "Ingener",
    "contacto": "",
    "obra": "",
    "detalle": "Tinglado para sala de Bombas en Nva Palmira. Diseño interno de MMN con conexiones para abulonar en obra. Equipo de 3 personas, el cliente suministra equipos",
    "tipo_trabajo": "Montaje",
    "fecha": "2024-06-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "631abd11-fbb6-4966-9ae2-2b8c850962cf",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "34be8fec-a8c6-46fe-9a42-bf44df3c22a7",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3298,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3298,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "53421f49-581c-4519-bd01-50b50ee9be18",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 282.5,
            "usd_hora": 28.41,
            "subtotal_usd": 8025.39
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "7dde6e94-10e0-4e57-b72f-17724d79d963",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 235.97,
            "subtotal_usd": 235.97,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "fae143e6-8509-499a-b3ac-c9bb7f10c129",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 371.5,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 371.5
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "bd3aefe0-66f5-4ae1-a491-ed8225c90147",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 3203.14,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 3203.14
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a0f0caa7-8413-418a-badb-51c075aaac29",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "71cd5d46-3fa5-47d7-9f68-0b1c63284242",
    "nro": "H-14483",
    "nombre": "Montajes",
    "cliente": "Cosud",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura Soporte - Cerramiento Fachada para silleteros o maniobras de limpieza de vidrios en edificios - HDG + Pintura SW: 9.560 kg",
    "tipo_trabajo": "Montaje",
    "fecha": "2024-06-19",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7b7120ad-6a3f-491e-bfaa-e70c3b10f8e8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ed454ea7-8c55-4583-9b85-0c867f775ab2",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 11018.72,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 11018.72,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "2a3a9faf-8cf4-42cd-af5c-b9f210917ce6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 1083,
            "usd_hora": 26.33,
            "subtotal_usd": 28517.7
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "c53d2de2-8163-46e0-a1b6-99a2fd9cb535",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1698.29,
            "subtotal_usd": 1698.29,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "93e101d9-312f-4cd5-9483-d8b560d873a6",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2262.01,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2262.01
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "96b63624-5468-40f0-82ac-f4415fb4b932",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 2262.01,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 2262.01
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "6dca1d64-f82c-4ea5-864e-64681bb6dbd7",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "59960f45-927f-4328-b5d8-63896aaf86e4",
    "nro": "H-14546",
    "nombre": "Montajes",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Refugio Peatonal para Estaciones. Complicaciones con los suministros y lluvia",
    "tipo_trabajo": "Montaje",
    "fecha": "2024-09-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2dad3ee3-9f71-47cb-b893-3dff060c464a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1ff09b9e-bf11-4e05-a529-4dcd43193a43",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 563,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 563,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "e1bf6ad9-3198-499d-beca-fef63c9801da",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 26,
            "usd_hora": 92.88,
            "subtotal_usd": 2414.81
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "7663e1a2-8a02-4f9a-a750-c70012768b42",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 270.86,
            "subtotal_usd": 270.86,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "599bab14-65ff-4ea5-9be8-b20d5504e2af",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 194.33,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 194.33
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e23653de-6124-4da4-af45-d7e5a3338854",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "2f4b06e1-2729-4467-8eaa-04213e81fd1d",
    "nro": "H-14550",
    "nombre": "Montajes",
    "cliente": "Cosud",
    "contacto": "",
    "obra": "",
    "detalle": "Montaje de 4 Vigas cajón que deben copiar la fachada exterior en curvatura del edificio. El trabjo tiene múltiples comentarios",
    "tipo_trabajo": "Montaje",
    "fecha": "2024-09-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "60073ab0-8646-4d7a-8d8e-bbdeb00a377e",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d4268ea5-53a9-4b88-8fba-428c8601e300",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4260,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4260,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "fccead0f-eb23-44ab-a483-90fa92749889",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 521,
            "usd_hora": 31.25,
            "subtotal_usd": 16283.02
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "4ef5c14a-ae49-4fde-8afa-1a8e78af71fb",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 4389.1,
            "subtotal_usd": 4389.1,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "16031b64-4b00-4c9a-be03-dfe3c582018c",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 115.76,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 115.76
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "9e49835e-e74a-42e6-b2bb-9bd8dd694f19",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 924.12,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 924.12
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e01a2c30-722c-4d6d-8ddd-f13983b8615d",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "273f0dda-51df-4f4b-a242-04345ed62c22",
    "nro": "H-14691",
    "nombre": "Montajes",
    "cliente": "JCDecaux",
    "contacto": "",
    "obra": "",
    "detalle": "Desmontaje de cartel existente y montaje de cartel nuevo de dimensiones generales: 4,73 x 1.20 x 3.78 mts.",
    "tipo_trabajo": "Montaje",
    "fecha": "2025-01-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7328c444-3e26-4637-a48f-0c946020b663",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e7cfc196-2075-4585-9a09-2aaaa6c928cf",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2218,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2218,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [
          {
            "id": "4bf281f7-31d0-4a49-9571-cd7b059699cb",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 231.52,
            "obs": "Importado desde histórico",
            "subtotal_usd": 231.52
          }
        ],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "8e0ad6e6-8a05-4090-b6b9-7b77d3e1ccd0",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 273,
            "usd_hora": 31.59,
            "subtotal_usd": 8623.16
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "57c4e5fc-4885-471a-8b14-986fce4c57b7",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 4747.77,
            "subtotal_usd": 4747.77,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "c45ce278-e1ca-4370-bb7a-b43ef08a8fca",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 897.55,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 897.55
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "daaf4a04-5e08-488f-a7f2-d200d431f647",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "8540ef01-bb28-4fe2-8d85-13065456cd5f",
    "nro": "H-14750",
    "nombre": "Montajes",
    "cliente": "Señales",
    "contacto": "",
    "obra": "",
    "detalle": "Desmontaje de cartel existente y montaje de cartel nuevo de dimensiones generales: 12 x 6 m",
    "tipo_trabajo": "Montaje",
    "fecha": "2025-03-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "533dc2ef-8596-4e90-9b04-5a4b6a75b93b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "843ef574-c026-41fe-a32f-39c6e09805ed",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5587,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5587,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [
          {
            "id": "0c328dd9-5e41-40cc-bc20-3876bf2b2e77",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 169.57,
            "obs": "Importado desde histórico",
            "subtotal_usd": 169.57
          }
        ],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "1d768fce-1cd0-4667-a220-e7ee20998c61",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 184,
            "usd_hora": 40.72,
            "subtotal_usd": 7493.23
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "fc8ac730-cac8-46f8-8723-4dd539868116",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 4901.58,
            "subtotal_usd": 4901.58,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "d0f6420b-3e70-45d3-b154-77e65535b880",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 675.62,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 675.62
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e3d52c45-c6bf-437c-bd64-1a88e3ed0cfe",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "a9060676-3a71-413b-85b6-2c9a626aaa02",
    "nro": "H-14812",
    "nombre": "Montajes",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Tinglado para sala de Bombas en Nva Palmira. Diseño interno de MMN con conexiones para abulonar en obra. Equipo de 4 personas, el cliente suministra equipos. Ampliación",
    "tipo_trabajo": "Montaje",
    "fecha": "2025-05-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "3ee02f19-52b2-4651-992f-ab39bb9e023c",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "946ae440-f1be-429a-bd69-4349ed641f00",
            "nombre": "Montajes",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2104,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2104,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [
          {
            "id": "8a1fed66-b3bc-4e9a-b228-a4832812ad33",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 199.58,
            "obs": "Importado desde histórico",
            "subtotal_usd": 199.58
          }
        ],
        "mo_fabricacion": [],
        "mo_montajes": [
          {
            "id": "f0946133-a66c-430b-a7d8-ad7cc4b01d37",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "",
            "cant_horas": 233,
            "usd_hora": 41.39,
            "subtotal_usd": 9644.83
          }
        ],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [
          {
            "id": "0b1fb4b8-e01d-4ce7-a1f2-2df51723c17d",
            "nombre": "Tercerización montaje (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 733.2,
            "subtotal_usd": 733.2,
            "detalle": "Importado desde histórico"
          }
        ],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "87e497a5-d117-4c47-b46b-e91662dc21a8",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 66.53,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 66.53
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "7a42f238-9e47-4225-b404-de9dd016dc80",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 2755.87,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 2755.87
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "66edf161-acdc-4703-a8b2-c974cf32f46e",
    "created_at": "2026-07-31T21:50:37.784754Z",
    "updated_at": "2026-07-31T21:50:37.784754Z"
  },
  {
    "id": "a4f6bd6f-e7c1-4604-86f0-96e5e530efa5",
    "nro": "H-3505",
    "nombre": "New Jersey",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "380x1500x850mm con 1 mano de antioxido y bulones [Desp: 4872.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-01-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "1fe755b4-12c3-4465-b93f-0b43e478d83b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "87a4fb2a-51ad-4b94-be47-5727bd062732",
            "nombre": "New Jersey",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 492,
            "area_pieza_m2": 0,
            "usd_kg": 2.303078162613124,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 492,
            "subtotal_m2": 0,
            "subtotal_usd": 1133.11
          }
        ],
        "mat_generales": [
          {
            "id": "cdd5a2bf-b535-47b9-b061-e7fc73ae16e1",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 198.69,
            "obs": "Importado desde histórico",
            "subtotal_usd": 198.69
          }
        ],
        "mo_fabricacion": [
          {
            "id": "a829a6cc-55cf-4d1c-a06e-20835b2bdfaf",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 34.5,
            "usd_hora": 47.69,
            "subtotal_usd": 1645.17
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "b24b2ef4-a816-43af-844d-f9db18baed40",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 39.67,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 39.67
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "ab843112-baff-489d-b527-8fd5f479d135",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5759,
            "kg": 492,
            "subtotal_usd": 283.36,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "19b19259-4065-47f6-850b-d37be74812de",
    "created_at": "2026-07-31T21:50:37.786239Z",
    "updated_at": "2026-07-31T21:50:37.786239Z"
  },
  {
    "id": "d223ccef-4fbe-4972-804c-8587b9f27690",
    "nro": "H--",
    "nombre": "New Jersey",
    "cliente": "Hopresa",
    "contacto": "",
    "obra": "",
    "detalle": "380x3000x910mm con 1 mano de antioxido y bulones (Inc Horas Extras) [Desp: 3710.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-11-04",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "c67a9db2-a6ff-4032-b747-56b907dc55a1",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "5b8bfff8-7e52-4daa-96af-f52d4e4741c2",
            "nombre": "New Jersey",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2450,
            "area_pieza_m2": 0,
            "usd_kg": 2.264688256363324,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2450,
            "subtotal_m2": 0,
            "subtotal_usd": 5548.49
          }
        ],
        "mat_generales": [
          {
            "id": "ff369177-8e20-4f7f-9819-ef94f928e29d",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1115.64,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1115.64
          }
        ],
        "mo_fabricacion": [
          {
            "id": "3991f67a-55d5-4be3-a796-dcd552381c8c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 250,
            "usd_hora": 24.1,
            "subtotal_usd": 6023.79
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "f066f1c4-b7b0-4dd2-9fab-2357ede2b9bf",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 222.8,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 222.8
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "49b5594b-a3a0-4e86-b0a2-66f4d44478c9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6487,
            "kg": 2450,
            "subtotal_usd": 1589.29,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "05934218-9586-4f35-9a48-e5ece7072e5e",
    "created_at": "2026-07-31T21:50:37.786239Z",
    "updated_at": "2026-07-31T21:50:37.786239Z"
  },
  {
    "id": "0015e72d-ef4f-4849-b5cb-45bb9321511a",
    "nro": "H-4258",
    "nombre": "Platinas",
    "cliente": "Servipiezas",
    "contacto": "",
    "obra": "",
    "detalle": "Cancamos y Platinas [Desp: 23.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-10-25",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "456b29fb-1359-48c7-94d6-89129134ef05",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "84cb9a08-1acb-4774-a4ca-81035f67e227",
            "nombre": "Platinas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 108,
            "area_pieza_m2": 0,
            "usd_kg": 1.767888366600813,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 108,
            "subtotal_m2": 0,
            "subtotal_usd": 190.93
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "e7b749cf-e4b3-4de8-aad0-47bdbf32f630",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 3,
            "usd_hora": 18.76,
            "subtotal_usd": 56.28
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c216c2bf-b1d2-4af6-b961-519ae74eb49d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7665,
            "kg": 108,
            "subtotal_usd": 82.79,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d031ea9b-9a9d-47d5-a7a2-56776e132557",
    "created_at": "2026-07-31T21:50:37.787283Z",
    "updated_at": "2026-07-31T21:50:37.787283Z"
  },
  {
    "id": "f2663a94-d7c6-466e-ac97-fe3ea1a706e1",
    "nro": "H-4379",
    "nombre": "Platinas",
    "cliente": "Servipiezas",
    "contacto": "",
    "obra": "",
    "detalle": "Cancamos y Platinas [Desp: 24.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-03-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7583b7af-2dac-48e6-9633-57676282298a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ef53a448-06de-4319-95f8-4bd0080839e3",
            "nombre": "Platinas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 76,
            "area_pieza_m2": 0,
            "usd_kg": 2.003862169033147,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 76,
            "subtotal_m2": 0,
            "subtotal_usd": 152.29
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "6ea24a01-1bc1-4201-82c5-19aed04411e8",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 5,
            "usd_hora": 9.33,
            "subtotal_usd": 46.65
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "5abb7913-bd7e-4a5e-abb7-39608c98d2da",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6718,
            "kg": 76,
            "subtotal_usd": 51.05,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "52210a4e-fb7e-455d-9eb1-77a123824eb1",
    "created_at": "2026-07-31T21:50:37.787283Z",
    "updated_at": "2026-07-31T21:50:37.787283Z"
  },
  {
    "id": "4b878201-cdb6-4aba-a49b-42b5cb9e3743",
    "nro": "H--",
    "nombre": "Pasos Peatonales",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "[Desp: 1410.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "66a46d6a-a1e4-4139-8694-0a5c22b8c4fb",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "9264e232-dbf2-442f-a0a4-de250171f203",
            "nombre": "Pasos Peatonales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 28500,
            "area_pieza_m2": 0,
            "usd_kg": 2.1581739906139705,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 28500,
            "subtotal_m2": 0,
            "subtotal_usd": 61507.96
          }
        ],
        "mat_generales": [
          {
            "id": "2ac8ee0f-25fb-40af-9da2-2a298073d70d",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2993.81,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2993.81
          }
        ],
        "mo_fabricacion": [
          {
            "id": "a844f86e-21cc-4b61-9b89-f73ac53a32a5",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1800,
            "usd_hora": 20.17,
            "subtotal_usd": 36303.32
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "6e55a9e5-7d8a-4545-84bd-d4366dfa5e0f",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 17396.46,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 17396.46
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "cffc2e79-0b27-424c-8caf-2f68a0c8e5f0",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3473,
            "kg": 28500,
            "subtotal_usd": 9898.45,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "032c53f2-6bc6-4b57-b208-01671e2434eb",
    "created_at": "2026-07-31T21:50:37.788795Z",
    "updated_at": "2026-07-31T21:50:37.788795Z"
  },
  {
    "id": "550ba8b7-77b7-4aa1-bd85-fc19b09f4570",
    "nro": "H--",
    "nombre": "Pasos Peatonales",
    "cliente": "CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "[Desp: 1880.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-05-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "faab93ea-f7ac-4f5a-8c04-5f3475ce10d8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "64e493ea-f403-4b4e-b631-3d043383fe3e",
            "nombre": "Pasos Peatonales",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 24700,
            "area_pieza_m2": 0,
            "usd_kg": 2.150394902767638,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 24700,
            "subtotal_m2": 0,
            "subtotal_usd": 53114.75
          }
        ],
        "mat_generales": [
          {
            "id": "489f95fe-861d-46de-b427-8f8eebff62c1",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2360.66,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2360.66
          }
        ],
        "mo_fabricacion": [
          {
            "id": "e29a6797-65fb-4a95-b5ec-bd9c3ccdd970",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1540,
            "usd_hora": 20.14,
            "subtotal_usd": 31022.35
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "2fd99ace-e6bf-42e0-a3ae-ffed6841160d",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 16822.65,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 16822.65
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "dcad0ee9-2a37-49ce-a296-8c6bba2610f5",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3514,
            "kg": 24700,
            "subtotal_usd": 8679.58,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "aa5c3517-710d-4f05-806a-311448a48f61",
    "created_at": "2026-07-31T21:50:37.788795Z",
    "updated_at": "2026-07-31T21:50:37.788795Z"
  },
  {
    "id": "c3418d72-c791-46c6-85b0-9e0dab7f99f0",
    "nro": "H-4559",
    "nombre": "Perfiles a Medida",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Perfiles Ipn cortados a medida y pintados con platinas, rigidizadores y pernos Nelson [Desp: 5.6%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-09-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "43656931-b58d-455c-b90b-ae499d81138d",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "17c4028a-297f-4922-b387-1d1767b31ce0",
            "nombre": "Perfiles a Medida",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 8546,
            "area_pieza_m2": 0,
            "usd_kg": 1.1607415680645592,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 8546,
            "subtotal_m2": 0,
            "subtotal_usd": 9919.7
          }
        ],
        "mat_generales": [
          {
            "id": "da892ce1-2f01-4f1a-aa42-290b257c6e0a",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2213.35,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2213.35
          }
        ],
        "mo_fabricacion": [
          {
            "id": "3b86fd39-e3f2-4ca4-a3a4-c9cfe03ab3ad",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 592,
            "usd_hora": 24.23,
            "subtotal_usd": 14346.39
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "297d798f-543f-4aa6-9711-a2ca04f4ed36",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 2833.59,
            "subtotal_usd": 2833.59,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "9d1bb514-fa10-4cdb-aec6-115eb1247aac",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 7702.1,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 7702.1
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "202d05e4-107b-4df8-b302-71d7b827b4f2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4663,
            "kg": 8546,
            "subtotal_usd": 3984.87,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f6bc9d93-ce66-4b35-aab5-b28c1d9dd05b",
    "created_at": "2026-07-31T21:50:37.788795Z",
    "updated_at": "2026-07-31T21:50:37.788795Z"
  },
  {
    "id": "da8412b0-d7e3-456d-a8d0-af8f80e3f349",
    "nro": "H-4787",
    "nombre": "Perfiles a Medida",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Perfiles Ipn 280 cortados a medida con perforaciones Ø40cm y pintados [Desp: 19.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-04-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "047aeb38-92c9-4e46-b40a-7ee2cf87c6da",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "2f2640b8-8596-4da2-8f8c-edfcd2d151a5",
            "nombre": "Perfiles a Medida",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3391,
            "area_pieza_m2": 0,
            "usd_kg": 1.7330068510745902,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3391,
            "subtotal_m2": 0,
            "subtotal_usd": 5876.63
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "1619b74f-78f3-4478-acc9-31c45ac1a0ea",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 68,
            "usd_hora": 78.85,
            "subtotal_usd": 5361.91
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "a86b5af3-3fda-4259-b57d-9638366ea3a7",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1468.47,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1468.47
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8f982e75-b48a-43b4-9c29-25f410e3f7ff",
    "created_at": "2026-07-31T21:50:37.788795Z",
    "updated_at": "2026-07-31T21:50:37.788795Z"
  },
  {
    "id": "04fb38ad-90a7-4a5f-a292-013a60bec25c",
    "nro": "H-4880",
    "nombre": "Perfiles a Medida",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Perfiles IPN200 pintados con 5 platinas soldadas [Desp: 56.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-07-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "5098ed89-450d-4523-86e4-d147da4c0e82",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "8b2a2d8e-73d6-4c79-abf8-3286141c4280",
            "nombre": "Perfiles a Medida",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 427.44,
            "area_pieza_m2": 0,
            "usd_kg": 1.835286898769987,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 427.44,
            "subtotal_m2": 0,
            "subtotal_usd": 784.48
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "916066aa-757d-4863-846a-c148cce5b2e6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 21,
            "usd_hora": 21.07,
            "subtotal_usd": 442.37
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "57d69f87-cef6-4b8e-b979-60c04eb17757",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 114.08,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 114.08
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "92fb9f15-da55-467e-adfe-941028b16f0a",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0212,
            "kg": 427.44,
            "subtotal_usd": 9.07,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "217cdd05-75dc-480e-aaae-e763e1f5b38c",
    "created_at": "2026-07-31T21:50:37.788795Z",
    "updated_at": "2026-07-31T21:50:37.788795Z"
  },
  {
    "id": "2cb7ef75-1de1-407c-89d3-6c6cd0388f9c",
    "nro": "H-3566",
    "nombre": "Plegados",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Angulos plegados 70x70 tercerizados [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-03-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "d1ac45a1-7689-4a81-86d7-a6347fb6e43a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "96b333cb-6620-44ed-8152-e15a10795928",
            "nombre": "Plegados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 790,
            "area_pieza_m2": 0,
            "usd_kg": 1.911465510849445,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 790,
            "subtotal_m2": 0,
            "subtotal_usd": 1510.06
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "c4d0ee8b-c8d7-4bd0-9cea-664cdea9f082",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 8,
            "usd_hora": 52.79,
            "subtotal_usd": 422.3
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "fdc42fd6-128f-4302-ae7a-9865f99b4bba",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 308.45,
            "subtotal_usd": 308.45,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "c4164843-8c17-40e4-a496-b87c34d2f4ef",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 730.74,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 730.74
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "d0a94a71-db4e-43fd-9070-344db2647350",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 97.45,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 97.45
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b11bcec2-beb9-4642-8ddd-24f8e23368a5",
    "created_at": "2026-07-31T21:50:37.790794Z",
    "updated_at": "2026-07-31T21:50:37.790794Z"
  },
  {
    "id": "518c388f-ab18-4a4c-add3-952af9c7ad5c",
    "nro": "H-3897",
    "nombre": "Plegados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Las piezas tuvieron que plegarse nuevamente por nuestro error [Desp: 0.4%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-12-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "6057fb1a-a6c4-4214-8429-63dd04cd8aed",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "7d704aa1-26ca-4688-99f5-422cb25e4902",
            "nombre": "Plegados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 380,
            "area_pieza_m2": 0,
            "usd_kg": 2.282682408561593,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 380,
            "subtotal_m2": 0,
            "subtotal_usd": 867.42
          }
        ],
        "mat_generales": [
          {
            "id": "3758e84f-588c-48a4-a190-58d07a8e166d",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 46.61,
            "obs": "Importado desde histórico",
            "subtotal_usd": 46.61
          }
        ],
        "mo_fabricacion": [
          {
            "id": "524643c3-0bda-4acf-94a2-696c4ad5dde6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 28,
            "usd_hora": 14.15,
            "subtotal_usd": 396.27
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "a38c7099-b897-4c0a-b74b-2c67a281eeab",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 158.6,
            "subtotal_usd": 158.6,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "6a956fb3-2daf-43c0-aa2a-65c02cf07555",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 32.69,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 32.69
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "58d396f4-581a-4d37-8d17-2f67f40c192e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7853,
            "kg": 380,
            "subtotal_usd": 298.42,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "6f859c96-10ea-4dd9-a25a-169a5f8d0c31",
    "created_at": "2026-07-31T21:50:37.790794Z",
    "updated_at": "2026-07-31T21:50:37.790794Z"
  },
  {
    "id": "23c9a6ae-42ac-42db-bb66-e7442e576ddc",
    "nro": "H-3982",
    "nombre": "Plegados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Plegados para Transformadores [Desp: 42.9%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "6c6f8370-8c9b-4664-9e58-f68253c747fb",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "8d9c29f3-6614-4dd1-8b33-330ef8681cee",
            "nombre": "Plegados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 315,
            "area_pieza_m2": 0,
            "usd_kg": 1.975374573505414,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 315,
            "subtotal_m2": 0,
            "subtotal_usd": 622.24
          }
        ],
        "mat_generales": [
          {
            "id": "0dfeefaa-7cce-494a-bcd2-6f3b4cc302b4",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 18.69,
            "obs": "Importado desde histórico",
            "subtotal_usd": 18.69
          }
        ],
        "mo_fabricacion": [
          {
            "id": "bf328e32-a245-4a30-be71-c4b83ac6fbe7",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 33,
            "usd_hora": 9.93,
            "subtotal_usd": 327.85
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "185c67c9-8580-41de-921e-e5555441aa61",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 130.47,
            "subtotal_usd": 130.47,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "a2618df0-7d4c-4277-9a09-2dcc190ce755",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 242.24,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 242.24
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "8ac50655-65cf-486d-8dca-7717668cd131",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7572,
            "kg": 315,
            "subtotal_usd": 238.5,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "389f6296-0f58-4ea7-945a-3afe975a4e1c",
    "created_at": "2026-07-31T21:50:37.790794Z",
    "updated_at": "2026-07-31T21:50:37.790794Z"
  },
  {
    "id": "b60ff331-d73b-4866-a399-47cc366758cf",
    "nro": "H-4062",
    "nombre": "Plegados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Accesorios para RMU de Skids [Desp: 6.5%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-05-30",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "61fc07f2-1e4c-49a0-bb80-c40b745fdf91",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "da427d57-0c7b-4c54-aeac-a14537717c3c",
            "nombre": "Plegados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 213,
            "area_pieza_m2": 0,
            "usd_kg": 1.3094108138664844,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 213,
            "subtotal_m2": 0,
            "subtotal_usd": 278.9
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "786b2266-ae38-40aa-8af8-d3452b686b5e",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 8,
            "usd_hora": 38.27,
            "subtotal_usd": 306.18
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "638dc0b9-1467-431a-b470-09f0c8dfc1c6",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 54.44,
            "subtotal_usd": 54.44,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "bc71db98-2bbe-4ec2-87fa-d68f02d3c99e",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 213.17,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 213.17
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "13016a2f-8999-4dd2-8da1-6c5c93773477",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 52.2,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 52.2
          }
        ],
        "corte_pantografo": [
          {
            "id": "5f2d8275-d586-4746-b686-709a79650e20",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6812,
            "kg": 213,
            "subtotal_usd": 145.1,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "19313933-f552-4b34-b991-3dfde5bcd7ad",
    "created_at": "2026-07-31T21:50:37.791795Z",
    "updated_at": "2026-07-31T21:50:37.791795Z"
  },
  {
    "id": "8d4bd635-8186-4ac2-89d1-055a66a0c683",
    "nro": "H-4099",
    "nombre": "Plegados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Accesorios para RMU de Skids [Desp: 6.5%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-27",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "dcfdc774-dab5-4d1d-b1ff-5d09532abb72",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "51de8b5c-f8c8-404a-9da0-291cc923afc4",
            "nombre": "Plegados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 213,
            "area_pieza_m2": 0,
            "usd_kg": 1.3094108138664844,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 213,
            "subtotal_m2": 0,
            "subtotal_usd": 278.9
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "372013aa-9e9b-42fa-894f-a513e2670189",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 7,
            "usd_hora": 43.74,
            "subtotal_usd": 306.18
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "33971b34-cc30-491d-89c8-901388a79450",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 54.44,
            "subtotal_usd": 54.44,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "cd5cbb9e-c0fe-45e3-8de4-df846e6cb546",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 213.17,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 213.17
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "5ee174db-86cd-4e78-8c00-94c2b109757c",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 52.2,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 52.2
          }
        ],
        "corte_pantografo": [
          {
            "id": "2f5db552-765e-47f3-8e49-a0e4dedfcb90",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6812,
            "kg": 213,
            "subtotal_usd": 145.1,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e07420cb-b59a-4710-9117-de7a6d6e8778",
    "created_at": "2026-07-31T21:50:37.791795Z",
    "updated_at": "2026-07-31T21:50:37.791795Z"
  },
  {
    "id": "744967a8-f5fd-4906-9172-fae59eb7c442",
    "nro": "H-4682",
    "nombre": "Plegados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Piezas Plegadas para Soportes Amorfos Art 8356 400kVA y Art 8354 160 kVA [Desp: 20.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-07",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2825737a-fc8f-470d-96c9-7cd3828a51c8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d7803562-53b4-419a-8e0b-cea912acd52d",
            "nombre": "Plegados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2260,
            "area_pieza_m2": 0,
            "usd_kg": 1.2422722774529653,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2260,
            "subtotal_m2": 0,
            "subtotal_usd": 2807.54
          }
        ],
        "mat_generales": [
          {
            "id": "dec49077-ca68-4d08-bfa1-a94d26feac5b",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 169.51,
            "obs": "Importado desde histórico",
            "subtotal_usd": 169.51
          }
        ],
        "mo_fabricacion": [
          {
            "id": "15834f90-5dfc-4e8a-83a4-a14ebb92b150",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 179,
            "usd_hora": 25.96,
            "subtotal_usd": 4647.44
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "05b14d30-72d4-4d23-a4d0-0ab7c7ab0454",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 822.84,
            "subtotal_usd": 822.84,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "e8b04aef-7717-4092-bd55-0be62efdc318",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 968.81,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 968.81
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "792ffac5-a2b4-43a6-8ccb-78a55cd44ad2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6964,
            "kg": 2260,
            "subtotal_usd": 1573.87,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e86a2c50-791f-4549-8374-545f642512ce",
    "created_at": "2026-07-31T21:50:37.791795Z",
    "updated_at": "2026-07-31T21:50:37.791795Z"
  },
  {
    "id": "da22c151-fc1b-4378-8277-44e1ed4904b0",
    "nro": "H-3439",
    "nombre": "Pernos - Insertos",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Pernos J Ø 1 1/4\" L=1m sin TS + Tuercas + Arandelas [Desp: 17.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-11-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "06a83dd3-1f2b-4d9b-9d6b-75e0059c812d",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "5c5f23a9-4f68-4a33-bbb5-2d93b9c505ea",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 224,
            "area_pieza_m2": 0,
            "usd_kg": 5.915399867812293,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 224,
            "subtotal_m2": 0,
            "subtotal_usd": 1325.05
          }
        ],
        "mat_generales": [
          {
            "id": "f7bc3ce8-3f43-4ca0-9d98-df1f19f0139a",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 320.85,
            "obs": "Importado desde histórico",
            "subtotal_usd": 320.85
          }
        ],
        "mo_fabricacion": [
          {
            "id": "85f6abdd-c64b-4d98-9cd4-528e052e490c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 17,
            "usd_hora": 26.71,
            "subtotal_usd": 454.1
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "47377b25-e17e-4c2c-91c8-afcca75ac693",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "090a4717-51a2-41c2-aa29-2fb71d48cc56",
    "nro": "H-3737",
    "nombre": "Pernos - Insertos",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Pernos Roscados HDG + Tuercas [Desp: 10.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-07-29",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "069ff587-a0de-47fe-9076-108ba9af86cd",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b61c113f-f547-47e6-8e87-3417fab448c2",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1540,
            "area_pieza_m2": 0,
            "usd_kg": 3.2523601710010683,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1540,
            "subtotal_m2": 0,
            "subtotal_usd": 5008.63
          }
        ],
        "mat_generales": [
          {
            "id": "02f23b81-024d-4bd9-aab2-9097d2d06494",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 7008.39,
            "obs": "Importado desde histórico",
            "subtotal_usd": 7008.39
          }
        ],
        "mo_fabricacion": [
          {
            "id": "26bcbf91-7e52-4c5c-a845-75c1db6ab408",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 485,
            "usd_hora": 16.17,
            "subtotal_usd": 7841.61
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "8b7a8588-5336-4229-b4c6-5d6e2d500a8c",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 192.11,
            "subtotal_usd": 192.11,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "55317176-2d13-4b09-90bd-5ae3ce272aa6",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2224.26,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2224.26
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9bbe6707-fb0e-41f7-9740-dd8b6460e04a",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "7835f7a5-eeb9-4644-818d-5685fc846490",
    "nro": "H-3834",
    "nombre": "Pernos - Insertos",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Pernos J HDG + Tuerca [Desp: 24.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-10-19",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "2c9179ff-6008-4bdd-95ac-1f1a85f43c94",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3d97493b-6cfb-475d-a748-3cf4fdd58c46",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 420,
            "area_pieza_m2": 0,
            "usd_kg": 5.665997523603157,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 420,
            "subtotal_m2": 0,
            "subtotal_usd": 2379.72
          }
        ],
        "mat_generales": [
          {
            "id": "3f1999de-1521-4873-b8af-e790fe2f3643",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1365.37,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1365.37
          }
        ],
        "mo_fabricacion": [
          {
            "id": "9c695167-9627-4d34-9d32-63cac4d4ff9b",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 120,
            "usd_hora": 25.94,
            "subtotal_usd": 3112.73
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "88825820-83fd-44cc-8ca8-0ecc5458e47a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 924.01,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 924.01
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "73a3ddf6-7765-4ad1-bc40-a7e7629ad4ad",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 159.16,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 159.16
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "cd9e947e-f8b3-4980-8d94-493be675187e",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "94bfd555-8abe-4b16-9c62-e7fe39db8ddb",
    "nro": "H-4135",
    "nombre": "Pernos - Insertos",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Pernos J Ø 1 1/4\" L=1,2m sin TS + Tuercas + Arandelas [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-07-25",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "b122a003-8370-4144-8a00-c6948a855a95",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f9be0a51-8b6f-4fdc-bf61-e0beb8aee569",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 150,
            "area_pieza_m2": 0,
            "usd_kg": 4.0541642534460784,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 150,
            "subtotal_m2": 0,
            "subtotal_usd": 608.12
          }
        ],
        "mat_generales": [
          {
            "id": "fe81ea5c-360a-4c03-a6ae-b7a450ae7145",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 196.37,
            "obs": "Importado desde histórico",
            "subtotal_usd": 196.37
          }
        ],
        "mo_fabricacion": [
          {
            "id": "8fa41847-88d5-4a62-b52d-8966151e1b1c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 6,
            "usd_hora": 35.92,
            "subtotal_usd": 215.51
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "81af4f9a-4c05-495d-b52e-a9cb6d389990",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "96729343-8cff-4bad-855f-8dbd07e55ebc",
    "nro": "H-4322",
    "nombre": "Pernos - Insertos",
    "cliente": "Ciemsa",
    "contacto": "",
    "obra": "",
    "detalle": "Pernos Roscados sin TS + Tuercas y Arandelas [Desp: 5.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-12-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "530372fa-32bc-4774-90bf-28db6495e309",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f7f0e297-042e-46fe-9f30-508953d86898",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 18855,
            "area_pieza_m2": 0,
            "usd_kg": 1.6040664712037047,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 18855,
            "subtotal_m2": 0,
            "subtotal_usd": 30244.67
          }
        ],
        "mat_generales": [
          {
            "id": "90359e72-6993-4088-9ecb-be612bb686e4",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1432.46,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1432.46
          }
        ],
        "mo_fabricacion": [
          {
            "id": "0c86b0ef-f5b8-4ca3-b757-5180bacbe95c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 563,
            "usd_hora": 24.68,
            "subtotal_usd": 13894.87
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "7749bbe2-065f-4d0e-8607-72dcf1d6f8dd",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "fcbe44a1-8feb-4244-892c-cfc281da84c1",
    "nro": "H-4516",
    "nombre": "Pernos - Insertos",
    "cliente": "Ciemsa",
    "contacto": "",
    "obra": "",
    "detalle": "Platinas con conformados soldados simples [Desp: 39.5%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-08-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "874b3490-8323-4df2-aab0-65cc515f914e",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f44044fa-61a6-43ee-8149-55922ca7479b",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 512,
            "area_pieza_m2": 0,
            "usd_kg": 1.4422060671846435,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 512,
            "subtotal_m2": 0,
            "subtotal_usd": 738.41
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "ef351df3-9286-4087-a0c8-2aa76abe1c97",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 20.75,
            "usd_hora": 30.82,
            "subtotal_usd": 639.54
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "b36d81a8-ea38-4ccb-8c24-7eb178604cb8",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 98.87,
            "subtotal_usd": 98.87,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "06879edc-ef98-498f-8899-7cd3f0ad81eb",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 551.18,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 551.18
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "c882a688-8809-4b1b-81be-ac2788bf186a",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "6e59386d-5293-4292-a31d-564d66e4dff9",
    "nro": "H-4538",
    "nombre": "Pernos - Insertos",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Platinas con conformados soldados complejos [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-09-02",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "a425c10d-ec4a-4f50-9f70-02981b23bbf0",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "133fe3ad-e57e-4143-95c1-a7bb5b319a45",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 237,
            "area_pieza_m2": 0,
            "usd_kg": 1.3419314659792025,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 237,
            "subtotal_m2": 0,
            "subtotal_usd": 318.04
          }
        ],
        "mat_generales": [
          {
            "id": "0d3ffe55-d403-4406-b286-f43dcbb3332f",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 51.73,
            "obs": "Importado desde histórico",
            "subtotal_usd": 51.73
          }
        ],
        "mo_fabricacion": [
          {
            "id": "26260539-c4c6-460f-8aa5-51e04cca9788",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 32,
            "usd_hora": 20.34,
            "subtotal_usd": 650.81
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "1decfb77-75bf-405b-8d59-623bf3039309",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1874,
            "kg": 237,
            "subtotal_usd": 44.42,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f4bccd96-0e62-438a-80b6-f6870ee1b869",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "b1f51808-cc34-4e42-88f6-e4c5a6cb74b7",
    "nro": "H-4554",
    "nombre": "Pernos - Insertos",
    "cliente": "Teyma",
    "contacto": "",
    "obra": "",
    "detalle": "Platinas con conformados soldados complejos [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-09-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "dc8fa684-fa09-4a47-90a1-3b200677f99c",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e0e6d672-1570-4104-976a-80360589442e",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 551,
            "area_pieza_m2": 0,
            "usd_kg": 1.227277233317225,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 551,
            "subtotal_m2": 0,
            "subtotal_usd": 676.23
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "b688b88a-8035-498f-af05-a8e9716f15ab",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 69,
            "usd_hora": 21.45,
            "subtotal_usd": 1479.93
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "6ea70b60-8281-4865-907c-f4b2680a18b5",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4425,
            "kg": 551,
            "subtotal_usd": 243.84,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9aeea317-f4e2-4972-8f03-1d8320f9fcb8",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "21548430-296a-4cf3-a875-0de2da067266",
    "nro": "H-4583",
    "nombre": "Pernos - Insertos",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Platinas con conformados soldados complejos [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-10-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "a91cfc98-1aa1-4474-a6ef-c74a4db8e9c8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d61662c0-90f4-46a7-87f8-ab347db05a6c",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 180,
            "area_pieza_m2": 0,
            "usd_kg": 1.2704498977505116,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 180,
            "subtotal_m2": 0,
            "subtotal_usd": 228.68
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "01e21bdf-f029-4626-838f-860e0a39fab7",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 18,
            "usd_hora": 55.65,
            "subtotal_usd": 1001.69
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "f0aafa3f-8a6f-4d4f-a6a8-a68cedba4d2b",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 108.44,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 108.44
          }
        ],
        "corte_pantografo": [
          {
            "id": "ff107120-e553-45b3-85bd-926e368ebd00",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.34,
            "kg": 180,
            "subtotal_usd": 61.2,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "4f63f97b-aab2-4f3a-aba6-527713a99bea",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "7f040f4f-4138-4a60-9ede-5ac436f0ed58",
    "nro": "H-4690",
    "nombre": "Pernos - Insertos",
    "cliente": "Arboreal",
    "contacto": "",
    "obra": "",
    "detalle": "Platinas Soldadas, Platinas y Perfiles Perforados. HDG [Desp: 32.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-09",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "91144212-fe89-4974-a56e-35cd6045e18b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "20bf17ff-27bb-4ca3-a621-471a407dd828",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 243,
            "area_pieza_m2": 0,
            "usd_kg": 1.5928493152784484,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 243,
            "subtotal_m2": 0,
            "subtotal_usd": 387.06
          }
        ],
        "mat_generales": [
          {
            "id": "ea41d940-a426-43e7-9c52-7c472d15df05",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 20.16,
            "obs": "Importado desde histórico",
            "subtotal_usd": 20.16
          }
        ],
        "mo_fabricacion": [
          {
            "id": "3c990b6b-2999-47af-b073-665f12e88b12",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 32.25,
            "usd_hora": 68.13,
            "subtotal_usd": 2197.1
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "508b4082-e80a-44e5-909a-e43b22a9e04c",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 266.42,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 266.42
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "70ba795c-e253-4d4f-9e9b-d1156fdce16d",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 103.13,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 103.13
          }
        ],
        "corte_pantografo": [
          {
            "id": "65d8077a-ab3c-4d92-8b66-3a8299e6dfd2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.91,
            "kg": 243,
            "subtotal_usd": 221.13,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b393bcbb-6579-4286-9125-b21aa640df9f",
    "created_at": "2026-07-31T21:50:37.794051Z",
    "updated_at": "2026-07-31T21:50:37.794051Z"
  },
  {
    "id": "c5a3c1d2-0ff3-4917-acd0-969f8ba8eef8",
    "nro": "H-4701",
    "nombre": "Pernos - Insertos",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Plantillas para Pernos. Excluir horas de Corte [Desp: 43.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "e410fdab-c330-404c-9b7d-bdabe4f190fa",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "598d47ea-a6c8-468e-b29a-8070cc369290",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 157,
            "area_pieza_m2": 0,
            "usd_kg": 1.4353706269777937,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 157,
            "subtotal_m2": 0,
            "subtotal_usd": 225.35
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "9fd438f2-2f34-4679-bfe9-b6f8b39e868d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 17,
            "usd_hora": 11.46,
            "subtotal_usd": 194.76
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "1d616661-0be6-4f47-bf87-733a67092463",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5025,
            "kg": 157,
            "subtotal_usd": 78.89,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ea3e4337-76ea-4505-9123-5c86b20dbcdf",
    "created_at": "2026-07-31T21:50:37.795498Z",
    "updated_at": "2026-07-31T21:50:37.795498Z"
  },
  {
    "id": "389444c7-f448-4ce5-9e5c-3f0ed7e2981a",
    "nro": "H-4714",
    "nombre": "Pernos - Insertos",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Pernos rectos Ø1/2\" ADN500 rosca 50mm L: 620mm [Desp: 5.2%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-28",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "b3660641-9f1b-4a65-805c-5be846764f41",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "59cb0fc9-c755-4a85-b59e-ba7f72a99447",
            "nombre": "Pernos - Insertos",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 39,
            "area_pieza_m2": 0,
            "usd_kg": 1.6978592851679657,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 39,
            "subtotal_m2": 0,
            "subtotal_usd": 66.22
          }
        ],
        "mat_generales": [
          {
            "id": "79af757f-5c81-42c2-806e-e410e0f6ecf1",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 111.1,
            "obs": "Importado desde histórico",
            "subtotal_usd": 111.1
          }
        ],
        "mo_fabricacion": [
          {
            "id": "814d314a-8d22-42f4-81b4-df72f572d7fb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 13.5,
            "usd_hora": 50.87,
            "subtotal_usd": 686.68
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b665d1c0-06a5-4af3-871d-e32d5d6dfae2",
    "created_at": "2026-07-31T21:50:37.795498Z",
    "updated_at": "2026-07-31T21:50:37.795498Z"
  },
  {
    "id": "f9f74402-bd83-4b1d-bd80-8025d9c75ab8",
    "nro": "H-2815",
    "nombre": "Portones",
    "cliente": "Teyma",
    "contacto": "",
    "obra": "",
    "detalle": "Portón batiente de acceso exterior de 2 hojas y 8 mts \nde largo total, con ruedas giratorias de hierro y goma. Incluye portón chico de 1,20 mts de largo [Desp: 21.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2020-04-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "40e8fcfa-f000-48aa-b982-fbf884814c32",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "b1f42592-bf80-44a1-b652-b400092ad561",
            "nombre": "Portones",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 324,
            "area_pieza_m2": 0,
            "usd_kg": 5.49304972478776,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 324,
            "subtotal_m2": 0,
            "subtotal_usd": 1779.75
          }
        ],
        "mat_generales": [
          {
            "id": "ee664dbf-c1ab-4b05-b023-4f87c19d08bc",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 375.62,
            "obs": "Importado desde histórico",
            "subtotal_usd": 375.62
          }
        ],
        "mo_fabricacion": [
          {
            "id": "3e181f59-c2cc-466e-b836-cc1835216951",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 147,
            "usd_hora": 4.66,
            "subtotal_usd": 685.14
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "266628da-a9cf-446e-b6c4-26af359c2eca",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 245.04,
            "subtotal_usd": 245.04,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "18cf4bde-7ea1-4079-a515-b6e4189b367c",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 82.22,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 82.22
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "b2804fb3-efdb-4723-84c1-8d08f2d1749f",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0995,
            "kg": 324,
            "subtotal_usd": 32.24,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "83f2268b-a39c-4407-a55d-c6646c8800fc",
    "created_at": "2026-07-31T21:50:37.796537Z",
    "updated_at": "2026-07-31T21:50:37.796537Z"
  },
  {
    "id": "dcef85d9-d6a8-4e79-8569-aa5f70f7b317",
    "nro": "H-2846",
    "nombre": "Portones",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "3 Portones batientes de doble hoja 6000 x 2000mm. Malla con sistema de angulo y planchuela. Galv Cal",
    "tipo_trabajo": "Fabricación",
    "fecha": "2020-06-02",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "3cc17a2a-2553-4cae-864f-2ad33168167f",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f9e44fda-c89b-4bed-93c8-279b36088b88",
            "nombre": "Portones",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 484,
            "area_pieza_m2": 0,
            "usd_kg": 0.8653075562305298,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 484,
            "subtotal_m2": 0,
            "subtotal_usd": 418.81
          }
        ],
        "mat_generales": [
          {
            "id": "4b8dcac4-2dd9-430b-b7b5-6ca66e415331",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 652.84,
            "obs": "Importado desde histórico",
            "subtotal_usd": 652.84
          }
        ],
        "mo_fabricacion": [
          {
            "id": "8f7bcb3e-321e-48b2-9ef0-cb27c708a1cb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 148.34,
            "usd_hora": 18.99,
            "subtotal_usd": 2816.75
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "d5a24630-b647-4bef-b7a0-6c7d59dc552c",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 439.42,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 439.42
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "5b94592c-f767-400b-a06b-46dde590bc9b",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 127.13,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 127.13
          }
        ],
        "corte_pantografo": [
          {
            "id": "4ddb9593-59f6-43ae-a855-6ee290e423fb",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0931,
            "kg": 484,
            "subtotal_usd": 45.05,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "aaa83c97-1a0d-4c8b-8613-c1b6636169cc",
    "created_at": "2026-07-31T21:50:37.796537Z",
    "updated_at": "2026-07-31T21:50:37.796537Z"
  },
  {
    "id": "17d91236-059f-47d1-8683-0424cb7be96b",
    "nro": "H-3133",
    "nombre": "Portones",
    "cliente": "Teyma",
    "contacto": "",
    "obra": "",
    "detalle": "3 Portones batientes de doble hoja Var x 2000mm y Puerta de Acceso Peatonal 900x2000mm. Pintados",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-02-26",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "a74f8b74-e973-478c-ae4b-8264f7e4371b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "9fbc2360-76ab-4291-bc63-88ef5d203b8a",
            "nombre": "Portones",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 602,
            "area_pieza_m2": 0,
            "usd_kg": 1.3095202107696209,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 602,
            "subtotal_m2": 0,
            "subtotal_usd": 788.33
          }
        ],
        "mat_generales": [
          {
            "id": "474abd3f-58c4-457b-a0a6-59eda91a5397",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 728.56,
            "obs": "Importado desde histórico",
            "subtotal_usd": 728.56
          }
        ],
        "mo_fabricacion": [
          {
            "id": "f9ec00a6-2bb2-403e-9e06-ee317ed23c09",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 172,
            "usd_hora": 17.6,
            "subtotal_usd": 3027.9
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "54e47b73-54cb-4e76-b5d1-a7023acc46cd",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 258.69,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 258.69
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c57b1c3e-1866-4cf9-8bf3-d4f2e096e726",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1603,
            "kg": 602,
            "subtotal_usd": 96.52,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f69b6a8e-54d7-49b9-adf5-80676239406a",
    "created_at": "2026-07-31T21:50:37.796537Z",
    "updated_at": "2026-07-31T21:50:37.796537Z"
  },
  {
    "id": "90fbdb47-837d-43af-9f5e-ed9dbb3a3427",
    "nro": "H-3175",
    "nombre": "Portones",
    "cliente": "Teyma",
    "contacto": "",
    "obra": "",
    "detalle": "2 portones batientes de doble hoja 2000x2000mm. Pintados [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-04-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "dcc24d8c-1737-4e0e-a732-d8e1deb404a2",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "83418108-ac5c-4620-9925-16a5bd6ade58",
            "nombre": "Portones",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 256,
            "area_pieza_m2": 0,
            "usd_kg": 1.3485514157878726,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 256,
            "subtotal_m2": 0,
            "subtotal_usd": 345.23
          }
        ],
        "mat_generales": [
          {
            "id": "8963f9f5-1b3b-4620-8369-3fe30268d546",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 262.13,
            "obs": "Importado desde histórico",
            "subtotal_usd": 262.13
          }
        ],
        "mo_fabricacion": [
          {
            "id": "e52ca897-86d8-46a9-b5f6-60366219c7ce",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 64,
            "usd_hora": 11.32,
            "subtotal_usd": 724.3
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "e4f6db5c-6841-4004-943f-dd151ed9f3e1",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 109.08,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 109.08
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "196ea6d8-97e6-4fc2-94d4-65f230c7e915",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1924,
            "kg": 256,
            "subtotal_usd": 49.25,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "47e1a18d-825c-4483-989d-63ff7f910b12",
    "created_at": "2026-07-31T21:50:37.796537Z",
    "updated_at": "2026-07-31T21:50:37.796537Z"
  },
  {
    "id": "fe8bce8b-88ca-4ccb-b97d-571390ee4dda",
    "nro": "H-3656",
    "nombre": "Regueras",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "27 regueras de 910x1000mm - Sep25mm - 90kg - PL 60mm",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-05-17",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "17892948-2aa2-44f0-bf28-68e92909092f",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e360586b-7a61-48a7-b8f9-d589cacd8659",
            "nombre": "Regueras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2712,
            "area_pieza_m2": 0,
            "usd_kg": 2.122653104766146,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2712,
            "subtotal_m2": 0,
            "subtotal_usd": 5756.64
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "a05899a4-03af-48c9-a309-cb77ce9f66c3",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 312,
            "usd_hora": 17,
            "subtotal_usd": 5303.95
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "d850871b-4b22-438e-8b6b-a660d384e551",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2399.09,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2399.09
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "aa2b9c07-4e62-4d92-93c5-49e6be5bf1ad",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 293.44,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 293.44
          }
        ],
        "corte_pantografo": [
          {
            "id": "ab7d1868-a9c9-4db0-8881-c88f69fec256",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4616,
            "kg": 2712,
            "subtotal_usd": 1251.89,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "807a54df-8d21-4b9c-ba86-1e6b111c528e",
    "created_at": "2026-07-31T21:50:37.798531Z",
    "updated_at": "2026-07-31T21:50:37.798531Z"
  },
  {
    "id": "877b619f-b709-48b7-baea-adb6c5823d23",
    "nro": "H-3658",
    "nombre": "Regueras",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "27 regueras dim varias y alturas variables.\n 931kg reales - 4,52 kg/h real - 8,60USD/KG",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-05-17",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "22bfcf46-214a-49c2-b2a3-8427c2d240cd",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a4bc0a75-018b-4d98-9082-f02c1b9ef987",
            "nombre": "Regueras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1338,
            "area_pieza_m2": 0,
            "usd_kg": 2.159712701044766,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1338,
            "subtotal_m2": 0,
            "subtotal_usd": 2889.7
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "a02a399b-0016-49bb-8c3d-ee205c77bb30",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 206,
            "usd_hora": 15.46,
            "subtotal_usd": 3184.25
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "0065d0b9-6727-48ef-b6f1-088e68759c7c",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1150.68,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1150.68
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "649b125a-a7c1-40f7-9729-e71650259cd5",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 179.03,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 179.03
          }
        ],
        "corte_pantografo": [
          {
            "id": "4da917d0-f29c-40e5-8d5d-d7c0e3764bc0",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4494,
            "kg": 1338,
            "subtotal_usd": 601.35,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "4441837c-39b3-4e96-9d6e-6c8a699a952e",
    "created_at": "2026-07-31T21:50:37.798531Z",
    "updated_at": "2026-07-31T21:50:37.798531Z"
  },
  {
    "id": "e1f0650a-022a-4a17-86b3-2264b7e081a9",
    "nro": "H-3697",
    "nombre": "Regueras",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "17 reg 1620x1000mm - Sep21mm - 300kg - PL 100mm\n18 reg 1120x1000mm - Sep33mm - 135kg - PL 100mm",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-27",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "4b0488fa-f091-49cd-bdb1-675018266410",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0b6459e6-5b1d-4d90-9cee-0f8d338d750d",
            "nombre": "Regueras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 10077,
            "area_pieza_m2": 0,
            "usd_kg": 1.9131460135473477,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 10077,
            "subtotal_m2": 0,
            "subtotal_usd": 19278.77
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "87a13155-0a22-4d8f-aecd-b42de27d5ba9",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 740,
            "usd_hora": 25.08,
            "subtotal_usd": 18557.54
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "e4539a5d-8de7-4817-9a8c-a0fff6b6efbe",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 8455.24,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 8455.24
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "516ce0b2-44ab-4bfc-84a8-7681b90afe96",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 204.6,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 204.6
          }
        ],
        "corte_pantografo": [
          {
            "id": "6904ab73-e38d-4e83-95a3-9984990a01d9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3477,
            "kg": 10077,
            "subtotal_usd": 3503.84,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "307fbd93-5df9-4062-a4b2-0653e9fabb13",
    "created_at": "2026-07-31T21:50:37.798531Z",
    "updated_at": "2026-07-31T21:50:37.798531Z"
  },
  {
    "id": "a2ea3701-247b-4b74-b625-531d198a81f7",
    "nro": "H-3749",
    "nombre": "Regueras",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "2 regueras de 1125x810mm - Sep21mm - 110kg - PL60mm\n2 regueras de 1405x1405mm - Sep21mm - 218kg - PL60mm",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-08-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ba9f5274-0cc8-49a4-9c9c-83038d17c8de",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "c2296d80-fc87-4d9e-aeb8-3a5d3ad8d7ca",
            "nombre": "Regueras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 669,
            "area_pieza_m2": 0,
            "usd_kg": 2.183685996351174,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 669,
            "subtotal_m2": 0,
            "subtotal_usd": 1460.89
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "7b98bb26-26b9-4f83-8d5f-3e754a4f1ec4",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 50,
            "usd_hora": 34.59,
            "subtotal_usd": 1729.61
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "0a9dc23a-cc34-4c18-b996-c9b04d3218bf",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 697.85,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 697.85
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "f16c8baf-586f-4d0a-85e4-116609874969",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 101.77,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 101.77
          }
        ],
        "corte_pantografo": [
          {
            "id": "6571ee55-742f-496f-bfde-9bb73b399f23",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4886,
            "kg": 669,
            "subtotal_usd": 326.88,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "385f88d4-b7ad-429e-bff3-b22951e6d9dd",
    "created_at": "2026-07-31T21:50:37.798531Z",
    "updated_at": "2026-07-31T21:50:37.798531Z"
  },
  {
    "id": "ab761941-129a-4adf-8a83-019b07dfff4d",
    "nro": "H-3808",
    "nombre": "Regueras",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "26 regueras con marco 450x450mm - Sep25mm - 22kg - PL60mm",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-09-23",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "11e74cc2-8c55-414d-adcc-978a2ff00602",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f5425ec5-696b-4c70-9444-2f0aea614709",
            "nombre": "Regueras",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 794,
            "area_pieza_m2": 0,
            "usd_kg": 1.8998238135748164,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 794,
            "subtotal_m2": 0,
            "subtotal_usd": 1508.46
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "1a91d6fa-35c9-4f29-9eef-481dd5557035",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 89,
            "usd_hora": 46.03,
            "subtotal_usd": 4096.53
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "268f6964-0622-419b-95e4-951fbf4998ee",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 769.93,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 769.93
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "9cf46b67-e840-4114-9530-f28b210c9223",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 293.99,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 293.99
          }
        ],
        "corte_pantografo": [
          {
            "id": "04608ae6-92f7-4a7a-a1ac-2957f470cf5a",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5895,
            "kg": 794,
            "subtotal_usd": 468.09,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "fd181072-0a6e-4a86-93a1-ef7de7112c1a",
    "created_at": "2026-07-31T21:50:37.798531Z",
    "updated_at": "2026-07-31T21:50:37.798531Z"
  },
  {
    "id": "7733e2d8-5dac-441d-a347-fde6725e1b75",
    "nro": "H-3588",
    "nombre": "Rejas",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "[Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-03-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "04557579-93d6-43dc-9764-7a35d88eacc2",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0b21768b-e17d-4ec4-b338-cd541945415f",
            "nombre": "Rejas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 14692,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 14692,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "347e92dc-0088-4205-b265-c881c81e1f06",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 934,
            "usd_hora": 16.81,
            "subtotal_usd": 15700.14
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "3830c8c2-1f6d-4556-90ee-9b152f1c87e4",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1554.5,
            "subtotal_usd": 1554.5,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "6f8414e2-a06e-42a6-a949-1987e0887a76",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 13370.08,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 13370.08
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "3a8b9862-49f9-4319-9bfc-3893691f6cd2",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1244.28,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 1244.28
          }
        ],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "bbb97fca-cdac-4892-8584-357f73a705f7",
    "created_at": "2026-07-31T21:50:37.799526Z",
    "updated_at": "2026-07-31T21:50:37.799526Z"
  },
  {
    "id": "f209ca9b-7d56-4810-b48a-28951cc7147e",
    "nro": "H-3466",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "Skids Pintados con Batea Inox [Desp: 1833.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-12-02",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8374da01-d936-4c14-9f35-27bb48ef13aa",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "36c092f9-b576-4a38-bd81-1a9945ba017d",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 15722,
            "area_pieza_m2": 0,
            "usd_kg": 1.682211402677424,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 15722,
            "subtotal_m2": 0,
            "subtotal_usd": 26447.73
          }
        ],
        "mat_generales": [
          {
            "id": "e4426f78-7f18-4cbc-b6bf-cdfd0b8e9987",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 9843.55,
            "obs": "Importado desde histórico",
            "subtotal_usd": 9843.55
          }
        ],
        "mo_fabricacion": [
          {
            "id": "ac20214f-0221-4825-9f05-e46531a16378",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1358,
            "usd_hora": 13.93,
            "subtotal_usd": 18913.89
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "a2782b53-25a8-4b58-95c3-d762b6abf842",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 27379.54,
            "subtotal_usd": 27379.54,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "80978436-da0a-4dff-b642-8d76d3b5f171",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 14453.07,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 14453.07
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "42cd4137-4721-44ca-bc25-b5385515fa7f",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1229.2,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 1229.2
          }
        ],
        "corte_pantografo": [
          {
            "id": "0eb90305-f2df-4eb1-92e7-ec20d12d8f70",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1955,
            "kg": 15722,
            "subtotal_usd": 3073.01,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f46365ce-e851-440d-a6fe-7aa3fb4f8c8f",
    "created_at": "2026-07-31T21:50:37.799526Z",
    "updated_at": "2026-07-31T21:50:37.799526Z"
  },
  {
    "id": "1e7ec3e4-8311-4bab-be58-89564be19e51",
    "nro": "H-3617",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "1036 kg/un - HDG [Desp: 2409.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-04-04",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "846e992c-d5dc-444a-ad15-32752ecac755",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "cc9efda3-7059-46f4-b833-b559dd8a5a7f",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2072,
            "area_pieza_m2": 0,
            "usd_kg": 2.1855083474470005,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2072,
            "subtotal_m2": 0,
            "subtotal_usd": 4528.37
          }
        ],
        "mat_generales": [
          {
            "id": "c8771f97-8013-486a-ae35-23febc700b02",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 457.09,
            "obs": "Importado desde histórico",
            "subtotal_usd": 457.09
          }
        ],
        "mo_fabricacion": [
          {
            "id": "eaef91ca-c2d7-43f1-bc2b-6146756fe66f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 208,
            "usd_hora": 31.96,
            "subtotal_usd": 6646.76
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "1cd0a13a-4d12-47d2-a3c9-e08560e9e3b0",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 851.14,
            "subtotal_usd": 851.14,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "0f9ae9e0-0500-4f19-a294-1834c6a12f89",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2222.42,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2222.42
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "ae44215a-5cdf-4e35-93b4-5e8521af9206",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 581.61,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 581.61
          }
        ],
        "corte_pantografo": [
          {
            "id": "57bb8ef9-8a17-43f4-ace4-e0ed94c3f90a",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2107,
            "kg": 2072,
            "subtotal_usd": 436.6,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8b7ffc88-ca80-4841-9b77-39cde4aa2e0d",
    "created_at": "2026-07-31T21:50:37.799526Z",
    "updated_at": "2026-07-31T21:50:37.799526Z"
  },
  {
    "id": "0eba2237-6951-41d1-948a-2ecef38e391e",
    "nro": "H-3670",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "4 LCL - 1.342 kg/un - HDG - 8991\n2 LC -  1.350 kg/un - HDG - 9045 [Desp: 2174.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-05-31",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "c28146ca-4d63-4a7e-af9c-cf0084ceb7b0",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "4354ee93-8696-442a-a7bc-192c6e92c73b",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 8068,
            "area_pieza_m2": 0,
            "usd_kg": 2.319235499755195,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 8068,
            "subtotal_m2": 0,
            "subtotal_usd": 18711.59
          }
        ],
        "mat_generales": [
          {
            "id": "db96e1f8-f1a8-4ef2-ac63-e09c137661b6",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 864.77,
            "obs": "Importado desde histórico",
            "subtotal_usd": 864.77
          }
        ],
        "mo_fabricacion": [
          {
            "id": "c0e0bb93-ee6e-4a4b-adbb-c0e70b8b6473",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 513,
            "usd_hora": 40.69,
            "subtotal_usd": 20876.43
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "19f840ee-331c-44a5-8286-aba75ea3e5c3",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1213,
            "subtotal_usd": 1213,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "a6173991-c96c-46b1-8664-6b2c1cdb5f81",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 8229.85,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 8229.85
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "6081eb50-c464-4c02-8b5f-0013a18b9a45",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1300.06,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 1300.06
          }
        ],
        "corte_pantografo": [
          {
            "id": "b5f07eb7-1fd6-468d-9364-5128a6b179d5",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3546,
            "kg": 8068,
            "subtotal_usd": 2861.29,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "bbba34c5-742f-4741-afa3-f06fff87cd8a",
    "created_at": "2026-07-31T21:50:37.799526Z",
    "updated_at": "2026-07-31T21:50:37.799526Z"
  },
  {
    "id": "f2a5405f-7f3b-410f-bb03-6c7157b8b174",
    "nro": "H-3702",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "1529 kg/un - HDG [Desp: 2082.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-30",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "e10a3df3-4291-40bc-b95c-54626ae7e4da",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "5cb5aea6-0408-40a4-a3ae-ea5bc6547977",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3200,
            "area_pieza_m2": 0,
            "usd_kg": 2.339985744832502,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3200,
            "subtotal_m2": 0,
            "subtotal_usd": 7487.95
          }
        ],
        "mat_generales": [
          {
            "id": "348d3dcd-b737-4536-9530-1249b5ff5630",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 873.59,
            "obs": "Importado desde histórico",
            "subtotal_usd": 873.59
          }
        ],
        "mo_fabricacion": [
          {
            "id": "da660ed1-4a20-40b3-b778-9b4dfaf69bff",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 232,
            "usd_hora": 31.46,
            "subtotal_usd": 7299.48
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "5889f9dd-0c1f-4e9e-bde1-145e325eddae",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 532.31,
            "subtotal_usd": 532.31,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "5ab9e815-5a03-45ab-a252-63f3df5b1591",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 3611.54,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 3611.54
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "19ecdaaa-13bf-43cc-93e0-fde765f15eae",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 646.92,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 646.92
          }
        ],
        "corte_pantografo": [
          {
            "id": "7253f690-c055-4047-92b1-1f1860eb7530",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3088,
            "kg": 3200,
            "subtotal_usd": 988.21,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2d8a25a8-5515-4358-9625-0995bed08ed4",
    "created_at": "2026-07-31T21:50:37.799526Z",
    "updated_at": "2026-07-31T21:50:37.799526Z"
  },
  {
    "id": "ebf9a52e-f479-4948-ade0-c1d55bce5850",
    "nro": "H-3739",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "1200 kg/un - HDG (Aprox) [Desp: 1900.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-08-01",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "63eee621-06e8-42f8-9107-376fdbf9b09c",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "32654b01-66b1-4800-824a-e43b2ccd9eaa",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 16700,
            "area_pieza_m2": 0,
            "usd_kg": 1.8261151414713321,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 16700,
            "subtotal_m2": 0,
            "subtotal_usd": 30496.12
          }
        ],
        "mat_generales": [
          {
            "id": "f7d749dd-d66e-4390-a3cf-ad22cdc69749",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 5110.83,
            "obs": "Importado desde histórico",
            "subtotal_usd": 5110.83
          }
        ],
        "mo_fabricacion": [
          {
            "id": "9b7f3dbb-9e6c-4214-8c25-801a856d9be2",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1241,
            "usd_hora": 33.09,
            "subtotal_usd": 41066.76
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "02d6682b-53d6-44b4-82e2-0a4953a1fec8",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1587.28,
            "subtotal_usd": 1587.28,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "2211fa66-5388-4afa-b37d-30d8091da228",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 16750.92,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 16750.92
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "b0272465-235f-4916-8588-fd37abb932b3",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 3354.69,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 3354.69
          }
        ],
        "corte_pantografo": [
          {
            "id": "0ac55ab0-c5c3-4ff7-8625-cf65783c75f5",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4961,
            "kg": 16700,
            "subtotal_usd": 8285.4,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "f5f60d1e-4030-4ad9-a05b-4d1e0ecbf84e",
    "created_at": "2026-07-31T21:50:37.799526Z",
    "updated_at": "2026-07-31T21:50:37.799526Z"
  },
  {
    "id": "fd816441-dd70-4e29-a8f4-a8bf9c104f37",
    "nro": "H-3886",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "1290 kg/un - HDG - 2669 x 5743mm [Desp: 3260.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "9b9e1d46-a4f5-4475-8cb1-cf37abac24c7",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "65b82121-d458-41e0-a019-3b9b2fb73f96",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1332,
            "area_pieza_m2": 0,
            "usd_kg": 2.13680247697469,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1332,
            "subtotal_m2": 0,
            "subtotal_usd": 2846.22
          }
        ],
        "mat_generales": [
          {
            "id": "f58e2036-a213-429c-820c-bb76e142599d",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 495.97,
            "obs": "Importado desde histórico",
            "subtotal_usd": 495.97
          }
        ],
        "mo_fabricacion": [
          {
            "id": "b681c9fa-30b8-46fd-bbad-391c8ef6305a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 140,
            "usd_hora": 27.91,
            "subtotal_usd": 3907.56
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "f2f11ec4-bc5d-4c3f-bdd0-5046d84a4181",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 212.27,
            "subtotal_usd": 212.27,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "42f4d32c-33e5-4c5c-bf92-45848e48e275",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1345.04,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1345.04
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "6170e51c-df6d-47d6-9441-f48df692dc5b",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 98.99,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 98.99
          }
        ],
        "corte_pantografo": [
          {
            "id": "950c5b7d-f9ef-4d3f-95c5-0642087ca404",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.521,
            "kg": 1332,
            "subtotal_usd": 693.95,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "443bdb26-c5ea-4505-9357-6fc07b5a14b4",
    "created_at": "2026-07-31T21:50:37.799526Z",
    "updated_at": "2026-07-31T21:50:37.799526Z"
  },
  {
    "id": "1af5b7a8-ae92-4efc-b855-0cf23f3d6dbe",
    "nro": "H-4067",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "1338 kg/un - HDG - 2669 x 5843 x 670\nPR-167-00 [Desp: 2200.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-05-31",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "910a4316-29c8-4881-bbab-9aa84ef23b63",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "be8ab0a8-3979-4bcc-b2eb-fd5338235557",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5600,
            "area_pieza_m2": 0,
            "usd_kg": 2.1035837506956043,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5600,
            "subtotal_m2": 0,
            "subtotal_usd": 11780.07
          }
        ],
        "mat_generales": [
          {
            "id": "ebf6a825-63b0-47b6-a029-30aa757a4533",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1432.32,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1432.32
          }
        ],
        "mo_fabricacion": [
          {
            "id": "0e6b81d3-dd01-4cec-80e8-d734250c3ed8",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 443,
            "usd_hora": 29.97,
            "subtotal_usd": 13275.02
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "9e6565a8-2f01-4371-893f-9b3fb9a96d95",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 684.84,
            "subtotal_usd": 684.84,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "ea337353-42b0-480b-9d28-7a03a3b6b0af",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 6668.83,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 6668.83
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "9371eaff-df4e-45fb-9450-578bab8a3ec7",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 872.75,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 872.75
          }
        ],
        "corte_pantografo": [
          {
            "id": "df402d49-bb29-4e78-a9a3-25399f492114",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5011,
            "kg": 5600,
            "subtotal_usd": 2806.17,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ed7c242c-dbf3-4375-9582-b719d24520f6",
    "created_at": "2026-07-31T21:50:37.800529Z",
    "updated_at": "2026-07-31T21:50:37.800529Z"
  },
  {
    "id": "2df87f03-ce2d-4f21-8d1d-0e3264fbf022",
    "nro": "H-4133",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "1334 kg/un - HDG - 2669 x 5663 x 760mm\nPR-170-00 Doble BT [Desp: 3000.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-07-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "a096357a-70b7-4cf2-bdba-06f522ec4592",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "4b546aef-fd7e-4ff2-ab28-f5357bb07ee3",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2668,
            "area_pieza_m2": 0,
            "usd_kg": 1.8583469624941544,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2668,
            "subtotal_m2": 0,
            "subtotal_usd": 4958.07
          }
        ],
        "mat_generales": [
          {
            "id": "f4177c18-dc8b-4966-91be-5eadc02b56b0",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 699.3,
            "obs": "Importado desde histórico",
            "subtotal_usd": 699.3
          }
        ],
        "mo_fabricacion": [
          {
            "id": "499de64c-ed22-4317-af72-0deab20f5b8c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 161,
            "usd_hora": 49.11,
            "subtotal_usd": 7907.29
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "4ce264d9-37e1-4028-a5bf-2e10d979c16f",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 608.09,
            "subtotal_usd": 608.09,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "85d06b25-cb36-422b-b8b5-b9df2e88f8bf",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 3042.6,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 3042.6
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "8b237611-4d41-472b-817f-ab96a4137560",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 425.66,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 425.66
          }
        ],
        "corte_pantografo": [
          {
            "id": "4dbf90fe-07c6-4455-a17a-722e25d5066e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5356,
            "kg": 2668,
            "subtotal_usd": 1429,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b8689b14-c9ad-49f1-8153-6675a1ecd561",
    "created_at": "2026-07-31T21:50:37.800529Z",
    "updated_at": "2026-07-31T21:50:37.800529Z"
  },
  {
    "id": "c0a826cd-d89b-46d8-a528-e2b07828fcdc",
    "nro": "H-4228",
    "nombre": "Skids",
    "cliente": "",
    "contacto": "",
    "obra": "",
    "detalle": "6un PR-180-00 - 669x5843x760mm \n2un PR-187-00 - 2000x6713x670mm [Desp: 3100.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-10-04",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8fefa24d-c922-4f3c-86aa-35e04d01e5a8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3992c7ad-16b9-47e9-ae32-04c47baf883a",
            "nombre": "Skids",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 8439,
            "area_pieza_m2": 0,
            "usd_kg": 1.6748481482218032,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 8439,
            "subtotal_m2": 0,
            "subtotal_usd": 14134.04
          }
        ],
        "mat_generales": [
          {
            "id": "5ba1280d-2b6f-4847-ad83-f0f2a64ba3bc",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 3362.14,
            "obs": "Importado desde histórico",
            "subtotal_usd": 3362.14
          }
        ],
        "mo_fabricacion": [
          {
            "id": "a5e30fe9-3386-4d04-9889-49936d5c3aaa",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 902,
            "usd_hora": 24.73,
            "subtotal_usd": 22307.63
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "0077c36f-8dca-40a0-9d6e-35b03c9ce598",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1057.61,
            "subtotal_usd": 1057.61,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "95da58b6-a3bd-47d4-bbb0-405dc9df2268",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 10288.8,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 10288.8
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "2b93addc-91ea-49d2-baa0-af348015a482",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 1632.11,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 1632.11
          }
        ],
        "corte_pantografo": [
          {
            "id": "8b257d66-6c56-4eeb-8987-a7c01ba398a4",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5353,
            "kg": 8439,
            "subtotal_usd": 4517.67,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "85d45173-34b0-4ae9-8c6c-9d965327bfa8",
    "created_at": "2026-07-31T21:50:37.800529Z",
    "updated_at": "2026-07-31T21:50:37.800529Z"
  },
  {
    "id": "c2fe324d-9222-4ea5-a0ed-524b6c572c96",
    "nro": "H-3823",
    "nombre": "Soportes - Perfiles con Platina",
    "cliente": "Ciemsa",
    "contacto": "",
    "obra": "",
    "detalle": "Tubulares con platinas. Galvanizados en Caliente [Desp: 24.9%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-10-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "f5ca1f92-7870-4ff9-a5af-6bfd4c2899e6",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "947218a7-fe8b-454f-9b09-26d84e34f5d2",
            "nombre": "Soportes - Perfiles con Platina",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4350,
            "area_pieza_m2": 0,
            "usd_kg": 1.8275862068965518,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4350,
            "subtotal_m2": 0,
            "subtotal_usd": 7950
          }
        ],
        "mat_generales": [
          {
            "id": "087fab1a-62a8-4b0b-9b93-4efd5e421de2",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1173.93,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1173.93
          }
        ],
        "mo_fabricacion": [
          {
            "id": "6a615ef2-43c6-4f71-94c0-56502e94b4d7",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 253,
            "usd_hora": 29.46,
            "subtotal_usd": 7452.2
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "55db183c-998f-428b-a2d9-578c285b1e57",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 4472.8,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 4472.8
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "1ddf2b9e-c03e-4870-b21e-bccdd4fee3bb",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 723.18,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 723.18
          }
        ],
        "corte_pantografo": [
          {
            "id": "eba4c4e1-8e57-4f43-8551-fa3ccd93e433",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4777,
            "kg": 4350,
            "subtotal_usd": 2077.9,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b66b9631-505f-44f7-88f9-5b27d75baf83",
    "created_at": "2026-07-31T21:50:37.802612Z",
    "updated_at": "2026-07-31T21:50:37.802612Z"
  },
  {
    "id": "1c8b1448-a77b-4af7-96bf-4ccf1fcb47ef",
    "nro": "H-3831",
    "nombre": "Soportes - Perfiles con Platina",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Soportes tipo pórtico. Galvanizados en Caliente [Desp: 14.3%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-10-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ab0c1eaf-8ed4-463e-8da0-e377f0c1de28",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ef600932-bd91-4032-9b18-2ead9b1e38cd",
            "nombre": "Soportes - Perfiles con Platina",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 360,
            "area_pieza_m2": 0,
            "usd_kg": 1.8583258298817453,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 360,
            "subtotal_m2": 0,
            "subtotal_usd": 669
          }
        ],
        "mat_generales": [
          {
            "id": "ba361cca-cddb-44a7-810f-db7f11bdfd37",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 108.86,
            "obs": "Importado desde histórico",
            "subtotal_usd": 108.86
          }
        ],
        "mo_fabricacion": [
          {
            "id": "bbce042f-f871-4699-90bf-5cc8d5b8836d",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 31,
            "usd_hora": 32.37,
            "subtotal_usd": 1003.5
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "276f67bc-e670-423e-af36-abe26c18198e",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 105.03,
            "subtotal_usd": 105.03,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "8702474b-a8f1-47b4-9f10-eaa66bdf6229",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 412.44,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 412.44
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "20cfdca1-b333-4af0-93d7-163d7d30cb86",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1838,
            "kg": 360,
            "subtotal_usd": 66.18,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "011c3622-4b14-4fa3-9a4f-be9ede2fef20",
    "created_at": "2026-07-31T21:50:37.802612Z",
    "updated_at": "2026-07-31T21:50:37.802612Z"
  },
  {
    "id": "9b05354b-bf1d-469b-8637-746a07a94b45",
    "nro": "H-3864",
    "nombre": "Soportes - Perfiles con Platina",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Perfiles varios para estructura de techo en UPM [Desp: 16.3%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-11-17",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "0b01bad7-990d-4d95-9e0e-f05300213945",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "2658131e-61ae-4b74-9caf-08633b7f0f64",
            "nombre": "Soportes - Perfiles con Platina",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 6432,
            "area_pieza_m2": 0,
            "usd_kg": 1.7989009833755263,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 6432,
            "subtotal_m2": 0,
            "subtotal_usd": 11570.53
          }
        ],
        "mat_generales": [
          {
            "id": "d9184a65-e73f-4327-87d4-5ae0230f4026",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1407.77,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1407.77
          }
        ],
        "mo_fabricacion": [
          {
            "id": "b1e6fff0-f289-41bc-ad2c-bc23575cf286",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 383,
            "usd_hora": 20.94,
            "subtotal_usd": 8021.13
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "b2620890-b005-45c7-b55e-4b69f6cf0040",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 122.79,
            "subtotal_usd": 122.79,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "a2ff0e83-80b4-471d-973c-f5599c3fb330",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 6490.58,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 6490.58
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "06c27d1e-0526-4f62-9465-9854731fadd8",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3711,
            "kg": 6432,
            "subtotal_usd": 2387.21,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "4c1a262d-0d0d-47bd-bdcc-37910b906b33",
    "created_at": "2026-07-31T21:50:37.802612Z",
    "updated_at": "2026-07-31T21:50:37.802612Z"
  },
  {
    "id": "fe4464e1-7096-4c0c-8660-afc5da6aabf3",
    "nro": "H-3896",
    "nombre": "Soportes - Perfiles con Platina",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Soportes Varios Perfiles y Platinas. Galvanizados en Calientes [Desp: 28.7%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-12-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "01558406-8718-4f96-9e4b-70f88ebdd25c",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1d2ab272-f849-4615-bb8a-90bee6ce59c1",
            "nombre": "Soportes - Perfiles con Platina",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2247,
            "area_pieza_m2": 0,
            "usd_kg": 2.5484705588297527,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2247,
            "subtotal_m2": 0,
            "subtotal_usd": 5726.41
          }
        ],
        "mat_generales": [
          {
            "id": "9ada9ad6-7572-4c80-94ac-0f70b2c609d0",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 338.09,
            "obs": "Importado desde histórico",
            "subtotal_usd": 338.09
          }
        ],
        "mo_fabricacion": [
          {
            "id": "a88aef28-c926-4f48-92d4-70c24a29b75e",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 178,
            "usd_hora": 25.3,
            "subtotal_usd": 4502.59
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "aba6168b-218a-455a-b6c4-f9029d9bfdb8",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 207.78,
            "subtotal_usd": 207.78,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "031b41cb-cf8d-45cb-91e9-f16043d25e45",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2759.31,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2759.31
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "95db2394-ea9e-4264-82a2-263c2d3853f6",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7413,
            "kg": 2247,
            "subtotal_usd": 1665.8,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "7a845012-8a11-4ba8-9a07-bddebadeeda4",
    "created_at": "2026-07-31T21:50:37.802612Z",
    "updated_at": "2026-07-31T21:50:37.802612Z"
  },
  {
    "id": "be33919b-dd56-4895-abf2-09bcea964ca5",
    "nro": "H-4747",
    "nombre": "Soportes - Perfiles con Platina",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Soportes de Platinas con UPN. Terminación Standard Pintura [Desp: 19.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-03-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "56569184-6d1a-41c3-99f8-082a27ad33bb",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0877aa67-9b66-454b-8bcd-397aca3a9963",
            "nombre": "Soportes - Perfiles con Platina",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 842,
            "area_pieza_m2": 0,
            "usd_kg": 1.2764652133531884,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 842,
            "subtotal_m2": 0,
            "subtotal_usd": 1074.78
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "1d4847b5-0eba-4e6a-9118-9410eb6fa2d6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 127,
            "usd_hora": 13.78,
            "subtotal_usd": 1750.02
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "2c41076d-6441-45e5-983a-db1d25d86c7c",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 506.53,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 506.53
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "60d5223e-b3ef-4f4a-91b0-1e77012d4859",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6754,
            "kg": 842,
            "subtotal_usd": 568.66,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a66e46cc-ceaa-4df5-9807-924b366fa599",
    "created_at": "2026-07-31T21:50:37.802612Z",
    "updated_at": "2026-07-31T21:50:37.802612Z"
  },
  {
    "id": "ab288d14-832e-4713-8868-9d6b59f064c0",
    "nro": "H-4774",
    "nombre": "Soportes - Perfiles con Platina",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Soportes conformados con perfiles UPN 100 y placas # 1/4\" de 200 x 200 mm. [Desp: 51.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-03-31",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "51723d1e-e9df-437f-b267-756c2b82b379",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3bcc2a21-0ef7-4e31-90b7-1d8171857aac",
            "nombre": "Soportes - Perfiles con Platina",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 275,
            "area_pieza_m2": 0,
            "usd_kg": 1.6216216216216217,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 275,
            "subtotal_m2": 0,
            "subtotal_usd": 445.95
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "856245b3-9a94-40ae-a7e5-371bff7a4462",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 81,
            "usd_hora": 16.77,
            "subtotal_usd": 1358.53
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "06ef4757-7ef8-4576-a3ad-c1191bc263a8",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 211.2,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 211.2
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "f845a023-f676-46bc-9869-6747b4d5b1ef",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6703,
            "kg": 275,
            "subtotal_usd": 184.32,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "0afa91a4-4191-498b-ae2a-42cf880ef29e",
    "created_at": "2026-07-31T21:50:37.802612Z",
    "updated_at": "2026-07-31T21:50:37.802612Z"
  },
  {
    "id": "221ba0b7-701f-4d01-846a-61776eff43d0",
    "nro": "H-2825",
    "nombre": "Trabajos Variados",
    "cliente": "Linde",
    "contacto": "",
    "obra": "",
    "detalle": "Pallets Pintados Antioxido y Sintético - 197kg/un [Desp: 6.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2020-05-11",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "158eb83c-bb19-4c8f-b0d2-a66b5eebf340",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3c612ec2-e748-4ce2-a0a9-0b142dc4b9d7",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 19652,
            "area_pieza_m2": 0,
            "usd_kg": 1.0080551789509318,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 19652,
            "subtotal_m2": 0,
            "subtotal_usd": 19810.3
          }
        ],
        "mat_generales": [
          {
            "id": "b9c56c97-a8c1-4f34-ba55-c3ef99d250c5",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2601.61,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2601.61
          }
        ],
        "mo_fabricacion": [
          {
            "id": "2806fc47-f566-46cf-8b3f-e3fcc85949fb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1392,
            "usd_hora": 13.23,
            "subtotal_usd": 18411.75
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "4de92128-e5ad-4500-8d09-3322f478c8e7",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 5002.7,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 5002.7
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "563513fd-78d6-47ff-902b-ba1eb633450a",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1732,
            "kg": 19652,
            "subtotal_usd": 3403.64,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9bdd9cfa-5179-4006-9375-2c494e330a77",
    "created_at": "2026-07-31T21:50:37.804622Z",
    "updated_at": "2026-07-31T21:50:37.804622Z"
  },
  {
    "id": "29e06dd2-b93d-4db3-b4eb-4efb0d645dfb",
    "nro": "H-3677",
    "nombre": "Trabajos Variados",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Ángulos pasados por maquina con perforaciones [Desp: 13.3%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-06-03",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "0c962271-c1d6-4836-82c5-e1d6ec499b4b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0287e893-1f06-4895-9e1c-071b95f6dd72",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 730,
            "area_pieza_m2": 0,
            "usd_kg": 2.192486636913561,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 730,
            "subtotal_m2": 0,
            "subtotal_usd": 1600.52
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "e4f9b667-9bf2-43f5-a6ac-08b4ba68f889",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 40,
            "usd_hora": 12.5,
            "subtotal_usd": 499.99
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "cf610464-26c1-4f9b-bc36-0d1056432fb3",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 883.51,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 883.51
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "cb705d9c-db6d-45d7-b26a-a98aecfc21c3",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 166.51,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 166.51
          }
        ],
        "corte_pantografo": [
          {
            "id": "08a6a61c-b6e1-45ec-b087-e425402e5fc9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 1.1417,
            "kg": 730,
            "subtotal_usd": 833.47,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "dabe8985-e774-45f9-9119-db44dbd923de",
    "created_at": "2026-07-31T21:50:37.804622Z",
    "updated_at": "2026-07-31T21:50:37.804622Z"
  },
  {
    "id": "da6568c3-e2d3-4b91-9d84-ca0f34693014",
    "nro": "H-3732",
    "nombre": "Trabajos Variados",
    "cliente": "Linde",
    "contacto": "",
    "obra": "",
    "detalle": "Pallets Pintados Antioxido y Sintético - 118kg/un [Desp: 15.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-07-27",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8163fc72-deb6-4b71-92fd-b32933661fb1",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "7db88e98-9410-49ff-b3ff-d4e718a6b275",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 11784,
            "area_pieza_m2": 0,
            "usd_kg": 2.3338650066937996,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 11784,
            "subtotal_m2": 0,
            "subtotal_usd": 27502.27
          }
        ],
        "mat_generales": [
          {
            "id": "6f5eba08-cea6-4919-a0f6-ecdc684b2760",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 2587.93,
            "obs": "Importado desde histórico",
            "subtotal_usd": 2587.93
          }
        ],
        "mo_fabricacion": [
          {
            "id": "06735384-430e-4fc9-97da-616c0542c4af",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1142,
            "usd_hora": 19.4,
            "subtotal_usd": 22159.72
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "5a330799-7735-484e-9680-8a38d6b91f92",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 4851.28,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 4851.28
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "aeac52af-d6a1-4107-b07b-67e4ebe53729",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.577,
            "kg": 11784,
            "subtotal_usd": 6798.81,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b2d30ccd-cd58-42fe-b41b-c01e42d56554",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "1a1b179e-27a0-4ff2-a49c-22848fbf1bae",
    "nro": "H-3874",
    "nombre": "Trabajos Variados",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Accesorios Y para el puerto. En las horas contaron al operario de las maquinas [Desp: 20.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-11-25",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "621eab93-98db-43ac-a88b-9b7084456032",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3a62f357-7e56-44f7-9ec5-42c710e77bc3",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 902,
            "area_pieza_m2": 0,
            "usd_kg": 2.044546655102792,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 902,
            "subtotal_m2": 0,
            "subtotal_usd": 1844.18
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "41a2cec9-0f32-4c80-a046-626ab6a20f0f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 131,
            "usd_hora": 19.34,
            "subtotal_usd": 2533.18
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "7d028f4c-dce7-46d3-9e85-b00c14d212df",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1073.82,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1073.82
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "6d6a06ff-d7e4-4c08-8b71-375385132e85",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 222.83,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 222.83
          }
        ],
        "corte_pantografo": [
          {
            "id": "ee8508c6-a517-4674-8547-7130b99a7175",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.9434,
            "kg": 902,
            "subtotal_usd": 850.99,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d3f73d39-eb72-4a15-a45f-49a823503fa1",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "c6261544-ae23-4e7f-9ac7-f85b0753d242",
    "nro": "H-3922",
    "nombre": "Trabajos Variados",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "Collar para hormigonado con diseño [Desp: 150.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-01-18",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "c9cb9e48-6a3e-4fcc-80c8-11d7ef5293fa",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "75e425fe-d2d0-432d-be95-2e46a12ec5df",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 45,
            "area_pieza_m2": 0,
            "usd_kg": 4.227086183310533,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 45,
            "subtotal_m2": 0,
            "subtotal_usd": 190.22
          }
        ],
        "mat_generales": [
          {
            "id": "32835e5f-e963-4994-bdb4-a235bd628d22",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 20.93,
            "obs": "Importado desde histórico",
            "subtotal_usd": 20.93
          }
        ],
        "mo_fabricacion": [
          {
            "id": "cf057223-ba40-4655-8b75-f279f7be2738",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 5.1,
            "usd_hora": 37.06,
            "subtotal_usd": 188.99
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "144b2e30-0b68-44e9-a9d4-6adce3b2de57",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 10.47,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 10.47
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "94116777-67be-473d-935f-f4e82b5dce0f",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.8755,
            "kg": 45,
            "subtotal_usd": 39.4,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "32637743-8fad-4ec8-8baf-2eb82a27ec61",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "71e88007-382f-45fb-bdf8-4190603f0b83",
    "nro": "H-3934",
    "nombre": "Trabajos Variados",
    "cliente": "Servipiezas",
    "contacto": "",
    "obra": "",
    "detalle": "Pieza plegada en L pintada con convertidor [Desp: 67.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-02-02",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "d6fad52e-e773-411a-a9d2-fa60edafa84f",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "757dce52-2eb6-426e-ad2a-9eea581a2cf6",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 75,
            "area_pieza_m2": 0,
            "usd_kg": 2.714399726370995,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 75,
            "subtotal_m2": 0,
            "subtotal_usd": 203.58
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "86d66321-19b1-4151-8574-1919b9b73c57",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 31,
            "usd_hora": 45.35,
            "subtotal_usd": 1405.77
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "642922c3-f579-4e9f-a577-9f87c04cf13b",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 105.07,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 105.07
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "38e09dd6-d6d9-453e-8293-7ab449363357",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 1.141,
            "kg": 75,
            "subtotal_usd": 85.58,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "7dd89b79-c78a-44dd-aedd-9097807f09d0",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "cdcb2eb9-418e-4c98-88c8-7bf82bb337d5",
    "nro": "H-3945",
    "nombre": "Trabajos Variados",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Campana para Pilotaje Ø1000 [Desp: 24.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-02-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "254de68a-47e3-44b6-9d5d-7712cceaae0a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "884190ea-7e74-42de-93c9-99f44582bbd2",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 387,
            "area_pieza_m2": 0,
            "usd_kg": 1.91940032093869,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 387,
            "subtotal_m2": 0,
            "subtotal_usd": 742.81
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "ba1f5597-ae5a-4206-9706-00c30e55eb1c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 7,
            "usd_hora": 40.14,
            "subtotal_usd": 280.96
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "5b266c51-250a-49d4-b9c4-8c09a5152eee",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 71.49,
            "subtotal_usd": 71.49,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "764dcb83-ca92-4b04-adac-879fc014ae7e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7874,
            "kg": 387,
            "subtotal_usd": 304.74,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d5c95666-009f-4e2a-b824-8350fb50b6ee",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "0e443283-e48d-448d-a8d8-492d5c2e3eb9",
    "nro": "H-3947",
    "nombre": "Trabajos Variados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Drenajes Skids [Desp: 150.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-02-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "acc183bc-f5f4-446d-a6ec-7440cd39af27",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "07d80e4c-8f75-43bc-a699-5234d1870b74",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 6,
            "area_pieza_m2": 0,
            "usd_kg": 3.4592576323303317,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 6,
            "subtotal_m2": 0,
            "subtotal_usd": 20.76
          }
        ],
        "mat_generales": [
          {
            "id": "976562be-707f-411c-b88d-f9dfa9f6c9c5",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 744.98,
            "obs": "Importado desde histórico",
            "subtotal_usd": 744.98
          }
        ],
        "mo_fabricacion": [
          {
            "id": "cdcf5738-76da-4b22-9aca-6037d36eb596",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 12,
            "usd_hora": 38.99,
            "subtotal_usd": 467.89
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "62049831-d3c6-4db0-87bf-889255898ea1",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 109.86,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 109.86
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "84ec9bcf-ca1e-487e-bf98-ab1a89fc3776",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 1.0872,
            "kg": 6,
            "subtotal_usd": 6.52,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8325b64b-f89a-419c-ae81-d87de756d6d6",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "ec3ebd3b-e2b3-46e8-8bae-3f847f6d3467",
    "nro": "H-3948",
    "nombre": "Trabajos Variados",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Campana para Pilotaje Ø500 [Desp: 41.6%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-02-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "70cc5a24-f566-4597-8720-47c05ab60fa3",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d7f7c7b5-2c7b-40d9-beb2-8a229dd1122e",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 203,
            "area_pieza_m2": 0,
            "usd_kg": 2.086298120780879,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 203,
            "subtotal_m2": 0,
            "subtotal_usd": 423.52
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "48773de1-94db-496e-ae5e-9d91997aeacb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 6,
            "usd_hora": 30.14,
            "subtotal_usd": 180.83
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "696083fb-2868-4ae3-ad09-bf9810e8ea54",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 33.33,
            "subtotal_usd": 33.33,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "6d907a3d-756d-4cd0-9130-377415539488",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7503,
            "kg": 203,
            "subtotal_usd": 152.31,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9d0babc2-8dc4-4bf8-aa37-b06081df9e78",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "60680767-6656-4b98-a0c1-95d785e8388a",
    "nro": "H-3953",
    "nombre": "Trabajos Variados",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Abrazaderas, piezas pantografo y abrazaderas armadas [Desp: 44.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-02-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "f4faa270-d90c-46f2-896f-fa45be72cc93",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "07b541ce-d6d2-443e-bdec-cb6c50516f57",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2040,
            "area_pieza_m2": 0,
            "usd_kg": 2.154910210364289,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2040,
            "subtotal_m2": 0,
            "subtotal_usd": 4396.02
          }
        ],
        "mat_generales": [
          {
            "id": "dfc85fdc-cbd9-467d-8e0d-9eede8f76c16",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 502.74,
            "obs": "Importado desde histórico",
            "subtotal_usd": 502.74
          }
        ],
        "mo_fabricacion": [
          {
            "id": "d7c29243-1231-4b58-850f-0f931d9ea151",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 470,
            "usd_hora": 27.13,
            "subtotal_usd": 12749.62
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "19fb3602-4f00-4693-8ee8-193c8afda374",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6572,
            "kg": 2040,
            "subtotal_usd": 1340.63,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "0c2bd4a9-b9b8-47c6-8d2b-39d0d4a04644",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "3e65325f-bde4-4e7f-98e7-3ed4b9b4f85d",
    "nro": "H-3956",
    "nombre": "Trabajos Variados",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Estructura Pequeña UPN180 [Desp: 50.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-02-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ae215cfd-2364-4005-bab2-873e2ce52730",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "dbf63fff-a5b3-414d-87de-88ccf78faabb",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 430,
            "area_pieza_m2": 0,
            "usd_kg": 2.100608347451101,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 430,
            "subtotal_m2": 0,
            "subtotal_usd": 903.26
          }
        ],
        "mat_generales": [
          {
            "id": "4fdb0612-0cba-4be9-9035-3a7b48104d52",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 307.04,
            "obs": "Importado desde histórico",
            "subtotal_usd": 307.04
          }
        ],
        "mo_fabricacion": [
          {
            "id": "9cef9719-eb19-452b-9316-c12a994e9ae3",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 25,
            "usd_hora": 12.28,
            "subtotal_usd": 307.04
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "f29881db-3e90-4f17-a210-f2b5bcaa70a9",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 155.82,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 155.82
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "4273b45a-cf1b-46e9-b4f4-720542ead1be",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2484,
            "kg": 430,
            "subtotal_usd": 106.83,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "880038a6-8821-4ee0-ad64-fbec7168c4fb",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "0b6a2b40-ec9e-4c53-8d56-be5828e72055",
    "nro": "H-3959",
    "nombre": "Trabajos Variados",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Vigas UPN100 con Platinas para Galpón HDG [Desp: 26.2%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-02-28",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "079beadd-90ed-45f5-85b7-b476527f6e55",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a2eebe27-7c64-43ed-8724-f02fb264d83d",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1100,
            "area_pieza_m2": 0,
            "usd_kg": 1.653870372996738,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1100,
            "subtotal_m2": 0,
            "subtotal_usd": 1819.26
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "e6881f47-a7cb-44b8-b839-b3380f391cd2",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 63,
            "usd_hora": 34.69,
            "subtotal_usd": 2185.16
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "27b465fb-7291-4fca-8dea-c66a874106aa",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1098.28,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1098.28
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "f819a848-b63d-4792-98c7-09d7e68676eb",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 205.75,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 205.75
          }
        ],
        "corte_pantografo": [
          {
            "id": "e4855581-9912-4809-a2e4-269599f8d959",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.156,
            "kg": 1100,
            "subtotal_usd": 171.55,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "96d27df6-46a5-4dff-a9e4-4633c189d417",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "08d12cc4-d99d-40a0-ada7-0945aef8b4ef",
    "nro": "H-3966",
    "nombre": "Trabajos Variados",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Campana para Pilotaje Ø600 [Desp: 40.5%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "67ada9f3-bf6b-4cd5-ad9e-e9ac0be76572",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "78f364de-f67e-44ab-8737-bdc72d2e5a69",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 250,
            "area_pieza_m2": 0,
            "usd_kg": 1.9557166706415456,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 250,
            "subtotal_m2": 0,
            "subtotal_usd": 488.93
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "ecb44d37-afe2-4be3-82ee-6a9a82cacb46",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 12.42,
            "usd_hora": 19.2,
            "subtotal_usd": 238.45
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "159f3699-d97c-4345-a976-0486fc37ad67",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 41.78,
            "subtotal_usd": 41.78,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "117e753e-eb13-4cff-b9c9-e5fbf9b81764",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7633,
            "kg": 250,
            "subtotal_usd": 190.83,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "00d7327b-969e-4cf5-9537-fed0839cf40e",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "402ee31d-9b9d-4523-b053-4a1208dd3c49",
    "nro": "H-3972",
    "nombre": "Trabajos Variados",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "6 Perfiles UPN con placas base y platina guía para riel soldadas [Desp: 20.4%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-08",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "831e0274-7e4d-4d4b-9a39-4987abdd8d52",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "803489be-a89d-478a-8d8e-9f7ac0a21a6f",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 243,
            "area_pieza_m2": 0,
            "usd_kg": 1.5540002744613692,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 243,
            "subtotal_m2": 0,
            "subtotal_usd": 377.62
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "817902f8-3a40-4a29-9548-cf9019498a2c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 28,
            "usd_hora": 20.18,
            "subtotal_usd": 565.17
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "aa23737b-a4a2-4628-9ff5-8fef31768a90",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 247.66,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 247.66
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "6c752ab6-56bc-4f5c-9240-c74624740738",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 102.5,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 102.5
          }
        ],
        "corte_pantografo": [
          {
            "id": "bfb9cdc1-a211-46ba-be07-529bc628352d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3088,
            "kg": 243,
            "subtotal_usd": 75.05,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9eae2ba1-5e7b-4aac-ba96-aeef59811079",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "ab942001-1bac-4445-adcc-a961101f0db7",
    "nro": "H-3974",
    "nombre": "Trabajos Variados",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Accesorios Y para el puerto. En las horas contaron al operario de las maquinas [Desp: 14.3%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-08",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "1b06273b-3fa7-4350-be09-25108859bf17",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "11c5cbe1-e1f3-4a05-a2e4-dc9b1670bfb8",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 262,
            "area_pieza_m2": 0,
            "usd_kg": 1.5975193986268355,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 262,
            "subtotal_m2": 0,
            "subtotal_usd": 418.55
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "31dd853e-463c-4ca4-8c10-537d51aa68e1",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 40,
            "usd_hora": 21.74,
            "subtotal_usd": 869.43
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "3ec866d9-905b-4932-8b24-56c2e7ea1d62",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 272.67,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 272.67
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "88858216-0598-41b4-96ff-c6ca2a687a06",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 102.64,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 102.64
          }
        ],
        "corte_pantografo": [
          {
            "id": "27e09515-bb6b-4a19-8f25-483343ea8944",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.8653,
            "kg": 262,
            "subtotal_usd": 226.71,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "97e23043-daae-48be-806e-287fa248069f",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "d50dd799-5e06-47f7-9c70-8b7956a58937",
    "nro": "H-3984",
    "nombre": "Trabajos Variados",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Abrazaderas, piezas pantografo y abrazaderas armadas [Desp: 66.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8c61a7fa-748d-4edb-9fff-3d950c179eee",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "067b13ce-1869-4f97-a015-d5829597412e",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 276,
            "area_pieza_m2": 0,
            "usd_kg": 2.2082383744514513,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 276,
            "subtotal_m2": 0,
            "subtotal_usd": 609.47
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "90f0d889-adc3-4799-97b3-ab895ea3e3f9",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 129,
            "usd_hora": 14.02,
            "subtotal_usd": 1809.18
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "06df1ca4-8b46-4873-8ed6-872b8bc491d3",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6208,
            "kg": 276,
            "subtotal_usd": 171.35,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "26e0801a-4255-4975-8488-7b90b56f8bc7",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "ee3fc8cf-bc54-4d11-9c4e-456059e0e564",
    "nro": "H-4006",
    "nombre": "Trabajos Variados",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Plataforma con Escalera de Gato Pintada [Desp: 51.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-03-31",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "f0e69671-8707-4f29-a0cc-bc2549a17e3a",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "2d107e5f-e76c-4dfe-955f-c26b8686abfc",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 360,
            "area_pieza_m2": 0,
            "usd_kg": 2.0720862554267443,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 360,
            "subtotal_m2": 0,
            "subtotal_usd": 745.95
          }
        ],
        "mat_generales": [
          {
            "id": "beb552b8-4a6c-4e69-8c25-26b400b2344b",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 15.45,
            "obs": "Importado desde histórico",
            "subtotal_usd": 15.45
          }
        ],
        "mo_fabricacion": [
          {
            "id": "79a51a4d-5ab9-46ef-be72-1fc54da98428",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 121,
            "usd_hora": 10.89,
            "subtotal_usd": 1317.83
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "8bd14a3b-f239-46b2-baaf-fb629e5d0b52",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 204.7,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 204.7
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "a5a98964-46cf-43f9-a447-047b4f73c85e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7947,
            "kg": 360,
            "subtotal_usd": 286.08,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b4ee1073-29a3-4939-adaa-63420a9b9055",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "23460260-8d17-4d5b-b61b-f9209989d14c",
    "nro": "H-4090",
    "nombre": "Trabajos Variados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Tanques de Expansión para Skids. Se incluyó uno adicional y tuvimos errores a corregir aumentando las horas [Desp: 30.4%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "5477341c-cd3c-4c43-86be-0b63d80e7c05",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "bfb57369-f0c0-4daf-a2f8-4047b2f1e6ef",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 917,
            "area_pieza_m2": 0,
            "usd_kg": 1.7488888728553083,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 917,
            "subtotal_m2": 0,
            "subtotal_usd": 1603.73
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "38a94f3b-c887-47e1-b849-7f1b06fc0e11",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 228,
            "usd_hora": 20.81,
            "subtotal_usd": 4745.54
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "a547883c-bd35-4f57-908f-f94823f9683e",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 108.37,
            "subtotal_usd": 108.37,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "7b97edfe-f3a7-47c3-8a6b-9bfda2cfdf6b",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1657.92,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1657.92
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "a00c1049-4b69-409e-9d3f-d5beb7afa871",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7682,
            "kg": 917,
            "subtotal_usd": 704.43,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "edccfdb0-57d7-491a-97d5-7c82c4f24c89",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "cb2a1a12-a640-4187-b743-a13ad028c521",
    "nro": "H-4100",
    "nombre": "Trabajos Variados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Drenajes Skids [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-06-27",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "8e3d90b5-dc03-44d5-b7c0-d402b181fcea",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "d45b0999-5449-4867-a444-d334e28e961c",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4,
            "area_pieza_m2": 0,
            "usd_kg": 1.956521739130435,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4,
            "subtotal_m2": 0,
            "subtotal_usd": 7.83
          }
        ],
        "mat_generales": [
          {
            "id": "224a6d42-fbe2-463c-8167-65a807358f72",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 158.84,
            "obs": "Importado desde histórico",
            "subtotal_usd": 158.84
          }
        ],
        "mo_fabricacion": [
          {
            "id": "46055c04-e90d-476b-9054-a4d7febb6b90",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 0.75,
            "usd_hora": 207.85,
            "subtotal_usd": 155.88
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "2a06bfe3-a0db-4b94-950d-243617af3277",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 34.17,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 34.17
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "56a2076b-bd3f-4a1f-b3f6-980948cd61e9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.819,
            "kg": 4,
            "subtotal_usd": 3.28,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "eb455d12-1748-4952-aa57-ee1f0fa00bb6",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "27b3a474-1238-4987-b5e8-7aad85b24889",
    "nro": "H-4162",
    "nombre": "Trabajos Variados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Tanques de Expansión para Skids  [Desp: 25.2%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-08-17",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "ada6f117-35e1-4ad1-8cb1-8f6db6300871",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "33ca1d61-1b37-40e4-ac86-78bd4a6df58b",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 240,
            "area_pieza_m2": 0,
            "usd_kg": 1.409505545765523,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 240,
            "subtotal_m2": 0,
            "subtotal_usd": 338.28
          }
        ],
        "mat_generales": [
          {
            "id": "56125b90-623e-4ee1-850c-5ce92bb25073",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 144.25,
            "obs": "Importado desde histórico",
            "subtotal_usd": 144.25
          }
        ],
        "mo_fabricacion": [
          {
            "id": "4cfb1794-bdb9-407c-8c96-74fa2b332bb0",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 56,
            "usd_hora": 16.57,
            "subtotal_usd": 927.89
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "d3570c89-bc05-45c0-968f-c8df82f53bb0",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 22.35,
            "subtotal_usd": 22.35,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "45138654-3f0e-4ccc-858b-8e28ffc730d0",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 400.45,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 400.45
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "1ada14f7-a45c-47e6-9e0c-eb0fb17b1f68",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5282,
            "kg": 240,
            "subtotal_usd": 126.78,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "c8ad2c01-e263-416e-b3f0-4ca902408cbd",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "de871a6a-56fc-4a22-9d61-8810fb1576f2",
    "nro": "H-4171",
    "nombre": "Trabajos Variados",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Piezas para Sellado Puente la Barra [Desp: 81.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-08-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "f8851b52-8267-4d53-8766-1497d989d0c3",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "5e2c5d71-0778-47df-93d7-7e6687b06015",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 699,
            "area_pieza_m2": 0,
            "usd_kg": 2.9244041526538966,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 699,
            "subtotal_m2": 0,
            "subtotal_usd": 2044.16
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "e2aeda7e-9581-445f-8ba1-9acf8f16e5b4",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 78,
            "usd_hora": 35.9,
            "subtotal_usd": 2800.41
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "4edad9f0-b001-42d5-a508-60236a1cc50e",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 307.06,
            "subtotal_usd": 307.06,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c10e0e70-5bde-4e57-bad1-3bf82d487f8f",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 1.2137,
            "kg": 699,
            "subtotal_usd": 848.37,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b3b17d0f-65ab-437b-95d5-4feacca53323",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "2e411767-1551-4d85-bfef-e4dbf082f785",
    "nro": "H-4188",
    "nombre": "Trabajos Variados",
    "cliente": "Movil Uno",
    "contacto": "",
    "obra": "",
    "detalle": "Platinas Pintadas. Hubo un error que corregir [Desp: 77.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-09-05",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "d511ae02-ea98-48ab-8fe5-91164e7b38f4",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f3650e0e-d395-4bd4-a17b-e0858626b203",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2515,
            "area_pieza_m2": 0,
            "usd_kg": 2.3385484075413294,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2515,
            "subtotal_m2": 0,
            "subtotal_usd": 5881.45
          }
        ],
        "mat_generales": [
          {
            "id": "e00b6c20-de64-43bf-ad10-e91cee166a19",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 79.59,
            "obs": "Importado desde histórico",
            "subtotal_usd": 79.59
          }
        ],
        "mo_fabricacion": [
          {
            "id": "d5c0d101-97b3-4db7-a58d-f8b5e6a4ec42",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 145,
            "usd_hora": 18.37,
            "subtotal_usd": 2663.96
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "dcb9dd26-1eae-495d-af0d-4951934d2516",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 1186.66,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 1186.66
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "5a5bb134-1604-4cdd-99f6-82a4c360680e",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6713,
            "kg": 2515,
            "subtotal_usd": 1688.34,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a755f953-323c-4f67-b136-d7833f8558af",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "78f9d891-8660-4945-b4f0-a545b99ab8e0",
    "nro": "H-4193",
    "nombre": "Trabajos Variados",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Fabricación de 4 tablestacas esquineras con ángulo. El cliente suministra el material [Desp: 0.6%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-09-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "b69dea6b-6c1a-4bad-ac01-be17c4baae1b",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "91a1469f-238f-480b-b892-620845716b0e",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5823,
            "area_pieza_m2": 0,
            "usd_kg": 0.11029530460136243,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5823,
            "subtotal_m2": 0,
            "subtotal_usd": 642.25
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "aa4092b5-2eb7-48ba-9723-e1ad4fccaecb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 157,
            "usd_hora": 33.55,
            "subtotal_usd": 5267.75
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": []
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "5078e60f-bd5c-49d4-a448-aca77f1a7235",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "41eee489-20a3-40ac-8dba-9f5dfd1568d4",
    "nro": "H-4212",
    "nombre": "Trabajos Variados",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Marco de Tensores. El cliente suministra perfiles y se realizan horas extras [Desp: 6.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-09-25",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7fc1f580-3852-4106-ab45-908cc792b714",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "32d63201-017a-477f-90a0-76b3149fcc37",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 9242,
            "area_pieza_m2": 0,
            "usd_kg": 0.3822966393763348,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 9242,
            "subtotal_m2": 0,
            "subtotal_usd": 3533.19
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "5dc68664-059f-458a-967b-0e3bcd266ef5",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 160,
            "usd_hora": 80.74,
            "subtotal_usd": 12918.15
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "385b5069-9ffb-49b9-b6dc-f48ed259c9bb",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1091,
            "kg": 9242,
            "subtotal_usd": 1008.66,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "e1734c51-9b81-467e-9f74-2b588c987750",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "c7291271-7965-4d5a-981a-d7e8d22a23a2",
    "nro": "H-4216",
    "nombre": "Trabajos Variados",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Piezas para Piping - SFS 5374 [Desp: 26.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-09-29",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "0c6546c6-2e27-4a5c-9559-dc9e7e0b5598",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "3740d478-314a-4d91-ad24-03e316dde98e",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3675,
            "area_pieza_m2": 0,
            "usd_kg": 1.6011701435484527,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3675,
            "subtotal_m2": 0,
            "subtotal_usd": 5884.3
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "a03e0b5d-63af-43d0-a8de-ec58ce407291",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 409,
            "usd_hora": 45.65,
            "subtotal_usd": 18671.77
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "dda68a7d-6cae-4bb2-a15a-3778e6558192",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 3765.95,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 3765.95
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "b129beb7-f145-4504-8e43-6c60875f4518",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 393.36,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 393.36
          }
        ],
        "corte_pantografo": [
          {
            "id": "ee640d6d-f746-4961-bcf0-91213df270d2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4053,
            "kg": 3675,
            "subtotal_usd": 1489.61,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "d200ecd7-38b7-4e78-abbd-ea31cd4e8847",
    "created_at": "2026-07-31T21:50:37.805623Z",
    "updated_at": "2026-07-31T21:50:37.805623Z"
  },
  {
    "id": "94a2afea-593b-4dec-9a58-bbfa88067856",
    "nro": "H-4236",
    "nombre": "Trabajos Variados",
    "cliente": "Genba",
    "contacto": "",
    "obra": "",
    "detalle": "Pedestal ID080 [Desp: 561.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-10-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "15005380-0b86-4ecb-bf2e-639a4afaf5b8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1b2060cc-5506-463c-b267-e5ccdea726c5",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 30,
            "area_pieza_m2": 0,
            "usd_kg": 10.36493912293934,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 30,
            "subtotal_m2": 0,
            "subtotal_usd": 310.95
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "3545f2ab-1bc8-4427-aca2-a62238a17eaa",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 26.5,
            "usd_hora": 6.45,
            "subtotal_usd": 171.02
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "ebc660c0-688b-45e1-a009-e12bd2d4ae6a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 107.33,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 107.33
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "6e8a8100-5c5f-491b-afbf-d8175ce56eca",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.6901,
            "kg": 30,
            "subtotal_usd": 20.7,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "2bac44a4-7c60-4ba2-80b1-916f16f76ea4",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "38db6c1b-a6c4-4340-a125-5f230c1edb6e",
    "nro": "H-4237",
    "nombre": "Trabajos Variados",
    "cliente": "Genba",
    "contacto": "",
    "obra": "",
    "detalle": "Pedestal ID664 [Desp: 256.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-10-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "141f0356-b033-403e-8543-8c7afc27192f",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "41707947-c055-4ab4-b7e9-48f9cadd02d2",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 60,
            "area_pieza_m2": 0,
            "usd_kg": 5.480167014613778,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 60,
            "subtotal_m2": 0,
            "subtotal_usd": 328.81
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "44d7c106-bf84-45e6-95e0-3b599406509c",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 3,
            "usd_hora": 48.23,
            "subtotal_usd": 144.68
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "b7c6fbac-4f8b-4969-9cd2-fcd564b8df21",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 109.6,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 109.6
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "88bcaa5d-c19e-4479-96fd-c9f8dbf507c5",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2818,
            "kg": 60,
            "subtotal_usd": 16.91,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a8431337-64d0-45ba-990c-95efdf676d85",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "c9bffea0-dc72-4f4d-a7ae-b41a599cdd74",
    "nro": "H-4284",
    "nombre": "Trabajos Variados",
    "cliente": "CIR",
    "contacto": "",
    "obra": "",
    "detalle": "Piezas para Piping - SFS 5374 [Desp: 35.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2023-11-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "792bc943-d26d-4180-b27a-4a7137ae0556",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "fce0dfea-ba4b-497f-90e7-790f3884a632",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 155,
            "area_pieza_m2": 0,
            "usd_kg": 1.6152666485205371,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 155,
            "subtotal_m2": 0,
            "subtotal_usd": 250.37
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "5d459a08-c49a-436b-9a30-1e6e45a9a1ae",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 21,
            "usd_hora": 33.27,
            "subtotal_usd": 698.59
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "68f80da7-60c6-4d01-979b-c3284e73d1af",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 153.12,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 153.12
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "a6d20cac-78c7-4dfe-a56e-1a7dbcce573a",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 102.04,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 102.04
          }
        ],
        "corte_pantografo": [
          {
            "id": "d8f56bef-a006-4de6-abdd-b004ee69a187",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.3605,
            "kg": 155,
            "subtotal_usd": 55.88,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "bfa8eaef-c373-41cf-b9c4-289b74135ba8",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "3f2e7713-a8c9-4756-9099-175ac74f08e2",
    "nro": "H-4357",
    "nombre": "Trabajos Variados",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "3470 Platinas pequeñas con limpieza [Desp: 25.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-02-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "06ffb8e5-9f59-4ece-aa72-5fe58c8cf502",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "09074797-7c51-48c5-9801-3ab42a664945",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 230,
            "area_pieza_m2": 0,
            "usd_kg": 2.8671784787681722,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 230,
            "subtotal_m2": 0,
            "subtotal_usd": 659.45
          }
        ],
        "mat_generales": [
          {
            "id": "819c1378-f27a-4c00-b6c1-1b421e832aa3",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 109.88,
            "obs": "Importado desde histórico",
            "subtotal_usd": 109.88
          }
        ],
        "mo_fabricacion": [
          {
            "id": "ffbd9822-ff8e-4696-b044-d756699fb4dd",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 96,
            "usd_hora": 5.72,
            "subtotal_usd": 549.57
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "9d556142-33ee-4afc-a670-49a305fcd99d",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 1.2222,
            "kg": 230,
            "subtotal_usd": 281.1,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "34c2c1d1-0396-46fe-aef0-aeb56fe13eaa",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "9e524d51-6880-44ac-86ee-b22237e7e839",
    "nro": "H-4383",
    "nombre": "Trabajos Variados",
    "cliente": "CMEC",
    "contacto": "",
    "obra": "",
    "detalle": "3470 Platinas pequeñas con limpieza [Desp: 22.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-03-08",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "7c946e32-4f6d-4d33-9318-f970450e5bbb",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "c2db491b-779c-4e64-bed0-e5000d0afb10",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 230,
            "area_pieza_m2": 0,
            "usd_kg": 2.616543872876461,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 230,
            "subtotal_m2": 0,
            "subtotal_usd": 601.81
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "f0ee5d4d-0749-4237-b3d2-bcc943329d37",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 117,
            "usd_hora": 6.34,
            "subtotal_usd": 741.67
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "8697709c-31bb-4ad5-abab-d794b6b2d5b2",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 1.1153,
            "kg": 230,
            "subtotal_usd": 256.53,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "57fb6adc-ea6b-450e-a3ec-a1633e9c9084",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "ca25d1c5-667a-4f5a-b415-0bce2017caf3",
    "nro": "H-4443",
    "nombre": "Trabajos Variados",
    "cliente": "Partiluz",
    "contacto": "",
    "obra": "",
    "detalle": "Tanques de Expansión para Skids. Fabricaron mal los tanques, faltaron piezas, hubo que llevarlas a la planta… etc [Desp: 39.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-05-06",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "d03fddfc-27d6-463f-99d0-600e4b654dca",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "a1339aba-5f8d-4761-81c3-565d12f61056",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 288,
            "area_pieza_m2": 0,
            "usd_kg": 1.7276925078043706,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 288,
            "subtotal_m2": 0,
            "subtotal_usd": 497.58
          }
        ],
        "mat_generales": [
          {
            "id": "b2e8fa90-1fdb-496f-b391-d9651a2561d0",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 68.83,
            "obs": "Importado desde histórico",
            "subtotal_usd": 68.83
          }
        ],
        "mo_fabricacion": [
          {
            "id": "a6c8fc76-0269-407f-a77a-23050376e95f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 71,
            "usd_hora": 20.6,
            "subtotal_usd": 1462.38
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "487a33fb-92be-499c-9c7d-8f4c738a7a5e",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 23.88,
            "subtotal_usd": 23.88,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "adad52c1-c024-419f-b5b7-f4b3a54b1f4a",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 314.67,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 314.67
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "d8cf1a55-1415-4daf-b31d-772da0fb8617",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 1.155,
            "kg": 288,
            "subtotal_usd": 332.65,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "fdb9def4-963e-421a-8710-168d082894d6",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "c514f39c-3371-4d74-8380-0b1a62dcef5a",
    "nro": "H-4572",
    "nombre": "Trabajos Variados",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Reciclaje de 2 vigas de apuntalamiento. [Desp: 8.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-10-02",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "3c9fa231-9a8c-4ff6-9ae1-3fe9119fddea",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1a8bec65-857b-4b33-9508-a31d29d5cfa6",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 2830,
            "area_pieza_m2": 0,
            "usd_kg": 0.3040840172877394,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 2830,
            "subtotal_m2": 0,
            "subtotal_usd": 860.56
          }
        ],
        "mat_generales": [
          {
            "id": "fd95094d-0c1e-4913-8a88-20da7b45457d",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 118.61,
            "obs": "Importado desde histórico",
            "subtotal_usd": 118.61
          }
        ],
        "mo_fabricacion": [
          {
            "id": "2c9c63c1-f926-451f-95c6-2c501b47ccd1",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 75,
            "usd_hora": 20.57,
            "subtotal_usd": 1542.78
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "87c5ec04-b2c5-41df-9a27-1d8215b675d1",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0629,
            "kg": 2830,
            "subtotal_usd": 178.06,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "a0d77deb-4d89-4d87-9361-673b36299427",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "d187cbb7-c9a0-4737-9070-3510c7044a48",
    "nro": "H-4696",
    "nombre": "Trabajos Variados",
    "cliente": "Bilpa",
    "contacto": "",
    "obra": "",
    "detalle": "Tubos para cámara de combustión sobre soportes de UPN [Desp: 29.3%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-01-16",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "5586627b-a781-477a-a00a-81beb5a57bcb",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0d7d6671-ab3a-4f8b-bcd5-4db39d551253",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1229,
            "area_pieza_m2": 0,
            "usd_kg": 1.2763891495219557,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1229,
            "subtotal_m2": 0,
            "subtotal_usd": 1568.68
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "848b3ad6-78b2-49d7-949e-f2bcf610596f",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 156,
            "usd_hora": 23.06,
            "subtotal_usd": 3597.67
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "660c8147-a0cd-46f3-92f2-c869c152daf8",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 99.85,
            "subtotal_usd": 99.85,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "97e543e9-c4f8-4920-b145-6567806b7ed2",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 298.92,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 298.92
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c82e043c-d9bf-4197-89dd-4fe7d971f72c",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5166,
            "kg": 1229,
            "subtotal_usd": 634.88,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ee133f73-8f5e-491b-9720-7ce83885cf9d",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "0e66353a-a5ae-4105-9701-9fc3b0e2eb0a",
    "nro": "H-4736",
    "nombre": "Trabajos Variados",
    "cliente": "Saceem",
    "contacto": "",
    "obra": "",
    "detalle": "Dispositivos para transporte de álabes. Conformados por planchas de acero liso de espesores 3/8\", 3/4\", 1\", 1 1/2\" [Desp: 35.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-02-20",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "823f3606-a22d-40aa-83f0-c265dfd32fe3",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "1bc1bd8b-b9b5-4a13-9e3d-01c927c8db4f",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 15023,
            "area_pieza_m2": 0,
            "usd_kg": 1.276134039237818,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 15023,
            "subtotal_m2": 0,
            "subtotal_usd": 19171.36
          }
        ],
        "mat_generales": [
          {
            "id": "4611796d-0836-4e60-91c1-feb9543bafc8",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 463.08,
            "obs": "Importado desde histórico",
            "subtotal_usd": 463.08
          }
        ],
        "mo_fabricacion": [
          {
            "id": "6d8d913e-c746-4789-be84-6bcd53340df6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 1538,
            "usd_hora": 20.21,
            "subtotal_usd": 31081.69
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "e1c65dbc-236e-4c49-bfce-9fee9103b7f1",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 463.08,
            "subtotal_usd": 463.08,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "a4d04a20-c864-47a0-80a7-294473cdc98f",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 3402.07,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 3402.07
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "c7f4309a-932c-49e9-b866-4aee72b60774",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.36,
            "kg": 15023,
            "subtotal_usd": 5408.73,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9ce8ece8-ee42-464f-8436-c2a25dbaab99",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "1826e3be-e1ec-43e3-b0ef-8a40be5aadfb",
    "nro": "H-4762",
    "nombre": "Trabajos Variados",
    "cliente": "MovilUno",
    "contacto": "",
    "obra": "",
    "detalle": "Viga de Elevación de dimensiones generales 6760 x 2400 x 410mm. Cap 20Ton [Desp: 25.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-03-21",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "b3ea14da-7d14-4b48-a94f-56cdfb25c523",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "7ddda049-e774-422f-9755-d77daf1a7ff8",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1195,
            "area_pieza_m2": 0,
            "usd_kg": 2.8739075908331175,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1195,
            "subtotal_m2": 0,
            "subtotal_usd": 3434.32
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "2f13e226-6cbe-4df4-9473-904cdf7c1007",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 84,
            "usd_hora": 30.06,
            "subtotal_usd": 2524.62
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "75f22258-2f1a-4cd5-9c6f-88d4d9c251b1",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 102.59,
            "subtotal_usd": 102.59,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "919ccef6-d203-41f8-9a86-ad7844fe8e82",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 500.05,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 500.05
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "d5d3ce21-1cf6-4c5b-b645-55e3b2a4d2a9",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1075,
            "kg": 1195,
            "subtotal_usd": 128.42,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9ab80a4f-170b-47e8-b6d9-af4cbfb57a45",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "e3b78b99-af8f-413a-8530-b04dbc5f69f7",
    "nro": "H-4834",
    "nombre": "Trabajos Variados",
    "cliente": "Ingener",
    "contacto": "",
    "obra": "",
    "detalle": "Guías para Montaje de Bandejas para Cables de Eléctricidad. El trabajo tiene un retrabajo al tener que ajustar nuevamente el sistema giratorio.  [Desp: 11.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2025-05-30",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "31f74134-6ace-4194-b073-f9e9515f9a7c",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "62287bda-aa55-4752-af13-b140b30209ee",
            "nombre": "Trabajos Variados",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1643,
            "area_pieza_m2": 0,
            "usd_kg": 1.4200428803557072,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1643,
            "subtotal_m2": 0,
            "subtotal_usd": 2333.13
          }
        ],
        "mat_generales": [
          {
            "id": "445a0eb3-f80e-4e59-a02e-103312301d99",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1266.79,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1266.79
          }
        ],
        "mo_fabricacion": [
          {
            "id": "75165946-9141-470a-af13-3094b6c598cb",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 256,
            "usd_hora": 17.12,
            "subtotal_usd": 4383.04
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "25681e7a-d869-4be6-b501-d281807eba02",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0104,
            "kg": 1643,
            "subtotal_usd": 17.04,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "9cdc6f3f-6e3b-4916-9c27-6d39f3e000e0",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "f603bde8-8fe1-4ad4-83eb-b94a310f07cb",
    "nro": "H-3773",
    "nombre": "Tuberías",
    "cliente": "Stiler",
    "contacto": "",
    "obra": "",
    "detalle": "8 Tuberías DN 400 a DN 700 + 4 Codos Bridados ND400 + 4 Bridas Ciegas DN700 [Desp: 0.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-08-30",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "6bd351a3-6ea4-44f2-924e-c382d1714bbe",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "e7d99be7-07b5-407c-919a-1fd5076b12d5",
            "nombre": "Tuberías",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4920,
            "area_pieza_m2": 0,
            "usd_kg": 0,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4920,
            "subtotal_m2": 0,
            "subtotal_usd": 0
          }
        ],
        "mat_generales": [
          {
            "id": "1fd02b40-5010-49ca-b93e-789aa0e540b0",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 803.08,
            "obs": "Importado desde histórico",
            "subtotal_usd": 803.08
          }
        ],
        "mo_fabricacion": [
          {
            "id": "de473141-46f2-468a-ba39-8e7fd81d7d88",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 667,
            "usd_hora": 15.9,
            "subtotal_usd": 10607.14
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "70e8394c-8083-4817-a9ed-c4ac09417847",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 2732.63,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 2732.63
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "cf676f38-6774-4c56-8572-8d2b5701c344",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4791,
            "kg": 4920,
            "subtotal_usd": 2357.14,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "0dadcaa2-5106-4efd-8854-3ad1b4520556",
    "created_at": "2026-07-31T21:50:37.806622Z",
    "updated_at": "2026-07-31T21:50:37.806622Z"
  },
  {
    "id": "dae3e1d6-1b74-4b80-a749-7fa6f4144e98",
    "nro": "H-1059",
    "nombre": "Vigas Conformadas - Cerchas",
    "cliente": "ATSH",
    "contacto": "",
    "obra": "",
    "detalle": "Vigas I conformadas de planchas de dimensión 400 x 400mm y 5/16\" -3/4\" (alma-alas)",
    "tipo_trabajo": "Fabricación",
    "fecha": "2015-07-10",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "96369a4d-6550-43e2-9308-a5e2c52d81c6",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "82fe8674-ccf8-4a71-adb0-46c142d8b7ce",
            "nombre": "Vigas Conformadas - Cerchas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 1200,
            "area_pieza_m2": 0,
            "usd_kg": 0.7412709105198158,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 1200,
            "subtotal_m2": 0,
            "subtotal_usd": 889.53
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "4d0a851f-25f4-478e-8bf3-3c6ccaa30cc6",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 46,
            "usd_hora": 40.43,
            "subtotal_usd": 1859.68
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "f01e55eb-1a19-441a-a1ce-b51b16fd6369",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 202.22,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 202.22
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "cf1d4485-089b-4f83-b1dc-959206b75482",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.7071,
            "kg": 1200,
            "subtotal_usd": 848.57,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "8ba57157-b7ba-47f7-b192-280812fa9df2",
    "created_at": "2026-07-31T21:50:37.807623Z",
    "updated_at": "2026-07-31T21:50:37.807623Z"
  },
  {
    "id": "3fd97679-2ef9-4897-ab7f-b0137e431e95",
    "nro": "H-3173",
    "nombre": "Vigas Conformadas - Cerchas",
    "cliente": "Pose Construcciones",
    "contacto": "",
    "obra": "",
    "detalle": "5 Vigas reticuladas (40 x 20)cm largo 10,80 mts + elementos varios incluyendo correas [Desp: 8.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-04-14",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "45215e17-f226-4341-b600-003af0329bc9",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "598293ba-8d55-4b9f-be50-958f17b5e7cb",
            "nombre": "Vigas Conformadas - Cerchas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3007,
            "area_pieza_m2": 0,
            "usd_kg": 1.6653165639822871,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3007,
            "subtotal_m2": 0,
            "subtotal_usd": 5007.61
          }
        ],
        "mat_generales": [
          {
            "id": "888d79f6-3a1d-4e3c-a228-e52dd36e365a",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 185.6,
            "obs": "Importado desde histórico",
            "subtotal_usd": 185.6
          }
        ],
        "mo_fabricacion": [
          {
            "id": "a5f6f8e7-9621-4618-9642-df4182dc8c56",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 378,
            "usd_hora": 14.96,
            "subtotal_usd": 5656.61
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "936cbe19-725f-4cf4-ad73-344934599633",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 526.06,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 526.06
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "d424197b-1a65-430d-83da-8b48652510c1",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.0413,
            "kg": 3007,
            "subtotal_usd": 124.13,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "ae1bd0a7-82b2-4f8b-8202-78ec5916c2ac",
    "created_at": "2026-07-31T21:50:37.807623Z",
    "updated_at": "2026-07-31T21:50:37.807623Z"
  },
  {
    "id": "92a4aaac-ec7c-4065-8091-5bd2d988d187",
    "nro": "H-3304",
    "nombre": "Vigas Conformadas - Cerchas",
    "cliente": "Sacyr - CCFC",
    "contacto": "",
    "obra": "",
    "detalle": "Vigas con platinas y presillas de UPN350. El cliente suministró las UPN350 [Desp: 5.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2021-07-29",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "e6eeea14-6651-4dfc-bd37-a4bd18808ec4",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "0a1ce367-d81b-4182-9caa-2f62b3fe2154",
            "nombre": "Vigas Conformadas - Cerchas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 19063,
            "area_pieza_m2": 0,
            "usd_kg": 0.36020612402661245,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 19063,
            "subtotal_m2": 0,
            "subtotal_usd": 6866.61
          }
        ],
        "mat_generales": [
          {
            "id": "205f1139-7eac-479e-ad7e-33c88c5d8a07",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 1107.63,
            "obs": "Importado desde histórico",
            "subtotal_usd": 1107.63
          }
        ],
        "mo_fabricacion": [
          {
            "id": "5b38916f-c4d0-458e-ad0b-d613eecf894a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 453,
            "usd_hora": 10.27,
            "subtotal_usd": 4651.35
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "6a1535c3-5adc-44d3-abbb-f013edde1111",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.1046,
            "kg": 19063,
            "subtotal_usd": 1994.41,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "3ca93e00-a9ce-401c-bbd2-263fd92089a6",
    "created_at": "2026-07-31T21:50:37.807623Z",
    "updated_at": "2026-07-31T21:50:37.807623Z"
  },
  {
    "id": "867a12a5-476e-49ee-872b-f5ba488aaabc",
    "nro": "H-3514",
    "nombre": "Vigas Conformadas - Cerchas",
    "cliente": "Andritz",
    "contacto": "",
    "obra": "",
    "detalle": "Vigas con platinas y presillas de IPN500. El cliente suministró las IPN500 [Desp: 38.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-01-26",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "156c0228-f395-408d-b23b-76000a291bb8",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "4fb9ba6a-57a4-45f2-a6f9-6c69e3ec86d2",
            "nombre": "Vigas Conformadas - Cerchas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 5656,
            "area_pieza_m2": 0,
            "usd_kg": 0.49775985479095397,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 5656,
            "subtotal_m2": 0,
            "subtotal_usd": 2815.33
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "1170f85c-b661-4d8c-bf17-d64f818f9e00",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 124,
            "usd_hora": 42.88,
            "subtotal_usd": 5317.45
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "d47b87bb-d31c-4ab2-9e00-d0f0cd40cb09",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 78,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 78
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "351ad79c-96a3-4021-b1e4-7ef78a8580b8",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.083,
            "kg": 5656,
            "subtotal_usd": 469.22,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "b0be81b8-e090-485e-acf9-f13df00adad4",
    "created_at": "2026-07-31T21:50:37.807623Z",
    "updated_at": "2026-07-31T21:50:37.807623Z"
  },
  {
    "id": "19989bf6-5891-4e52-8d8b-35fa6fc94330",
    "nro": "H-3871",
    "nombre": "Vigas Conformadas - Cerchas",
    "cliente": "Raul Clerc",
    "contacto": "",
    "obra": "",
    "detalle": "Vigas I conformadas de planchas de dimensión 320 x 320mm y 5/16\" - 5/8\" (alma-alas) [Desp: 25.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2022-11-24",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "6f83d8dd-ff2f-4fbd-a7ad-85cf257f8166",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "ef6c68ca-a743-440a-9983-e901214f035f",
            "nombre": "Vigas Conformadas - Cerchas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 9947,
            "area_pieza_m2": 0,
            "usd_kg": 1.9783328484880673,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 9947,
            "subtotal_m2": 0,
            "subtotal_usd": 19678.48
          }
        ],
        "mat_generales": [
          {
            "id": "02ad2143-2972-488f-961c-91dadfda0e26",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 228.51,
            "obs": "Importado desde histórico",
            "subtotal_usd": 228.51
          }
        ],
        "mo_fabricacion": [
          {
            "id": "b9f02649-2474-4944-b478-3d8700dbe984",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 349,
            "usd_hora": 24.12,
            "subtotal_usd": 8417.58
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "ac615ca8-958c-4e3e-b058-ad552dd44bcf",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.4459,
            "kg": 9947,
            "subtotal_usd": 4435.43,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "bfefb06f-3698-4542-acde-d35ea477390d",
    "created_at": "2026-07-31T21:50:37.807623Z",
    "updated_at": "2026-07-31T21:50:37.807623Z"
  },
  {
    "id": "2d5e6240-0bbd-49fc-9d95-ec5f5ab29534",
    "nro": "H-4500",
    "nombre": "Vigas Conformadas - Cerchas",
    "cliente": "Berkes",
    "contacto": "",
    "obra": "",
    "detalle": "Viga Reticulada de dimensión 600 x 900mm . Cordon superior, inferior y montante en UPN 300. Diagonales UPN 120 [Desp: 26.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-07-29",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "66619cb8-84b4-48ce-940f-498b97836cbf",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "4928e53e-55d0-4bb0-bc72-e77b0789e2fd",
            "nombre": "Vigas Conformadas - Cerchas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 3825,
            "area_pieza_m2": 0,
            "usd_kg": 1.3829845753776482,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 3825,
            "subtotal_m2": 0,
            "subtotal_usd": 5289.92
          }
        ],
        "mat_generales": [],
        "mo_fabricacion": [
          {
            "id": "40b92bbd-2a21-478a-b614-ad60375f155a",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 180,
            "usd_hora": 27.21,
            "subtotal_usd": 4898.03
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [],
        "corte_pantografo": [
          {
            "id": "2a814186-956b-41fb-afe6-7907fffff679",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.2868,
            "kg": 3825,
            "subtotal_usd": 1097.06,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "65869be5-dff3-4469-b880-dc03c18c0705",
    "created_at": "2026-07-31T21:50:37.807623Z",
    "updated_at": "2026-07-31T21:50:37.807623Z"
  },
  {
    "id": "45a73f73-e097-42c0-9be4-1ba7356320b2",
    "nro": "H-4550",
    "nombre": "Vigas Conformadas - Cerchas",
    "cliente": "Cosud",
    "contacto": "",
    "obra": "",
    "detalle": "Vigas Cajón de dimensiones 300x125mm en planchas 5/8\" y 1/2\". Soldadura en ángulo con bordes biselados en encuentros. [Desp: 93.0%]",
    "tipo_trabajo": "Fabricación",
    "fecha": "2024-09-13",
    "estado": "aprobado",
    "clonado_de": null,
    "items": [
      {
        "id": "34df698b-0e57-44a8-aade-7b3a3c7d6cea",
        "titulo": "Trabajo completo (importado de histórico)",
        "cantidad": 1,
        "n_plano": "",
        "no_agrega_kg": false,
        "computo_id": "",
        "hierros": [
          {
            "id": "f922544e-e80f-48d6-b599-099936e20d75",
            "nombre": "Vigas Conformadas - Cerchas",
            "proveedor": "",
            "fecha_precio": "",
            "obs": "Importado desde histórico — sin detalle de materiales pieza por pieza",
            "cantidad": 1,
            "kg_pieza": 4260,
            "area_pieza_m2": 0,
            "usd_kg": 1.9933120526306554,
            "arena": false,
            "pintura": false,
            "galvanizado": false,
            "subtotal_kg": 4260,
            "subtotal_m2": 0,
            "subtotal_usd": 8491.51
          }
        ],
        "mat_generales": [
          {
            "id": "3136097d-21fc-41c5-b1de-ec32d27f0b55",
            "nombre": "Materiales generales (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "kg_unit": 0,
            "m2_unit": 0,
            "usd_unit": 287.72,
            "obs": "Importado desde histórico",
            "subtotal_usd": 287.72
          }
        ],
        "mo_fabricacion": [
          {
            "id": "ce88a9a2-5e4b-4b9c-9d02-59f2110f49ec",
            "categoria": "Importado histórico",
            "tipo_hora": "Común",
            "pct_adicional": 0,
            "tarea": "",
            "detalle": "Incluye horas especiales del histórico si las había",
            "cant_horas": 324,
            "usd_hora": 46.46,
            "subtotal_usd": 15053.8
          }
        ],
        "mo_montajes": [],
        "horas_especiales": [],
        "terc_fabricacion": [
          {
            "id": "456113bd-ecb5-4176-8720-58962f4e5998",
            "nombre": "Tercerización fabricación (histórico)",
            "empresa": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 339.37,
            "subtotal_usd": 339.37,
            "detalle": "Importado desde histórico"
          }
        ],
        "terc_montajes": [],
        "trat_superficie": {
          "pinturas": [
            {
              "id": "9aefe8b2-bea0-4cb7-9b6e-b451d0ba63d0",
              "nombre": "Tratamiento de superficie (histórico)",
              "usd_lt": 5935.2,
              "cant_lt": 1,
              "cant_manos": 1,
              "subtotal_usd": 5935.2
            }
          ],
          "arenado_m2": 0,
          "arenado_usd_m2": 0,
          "galvanizado": false
        },
        "traslados": [
          {
            "id": "11e7017c-e5ff-419b-8835-f68341886605",
            "nombre": "Traslados (histórico)",
            "proveedor": "",
            "fecha_precio": "",
            "cantidad": 1,
            "unidad": "u",
            "usd_unit": 191.82,
            "detalle": "Importado desde histórico",
            "subtotal_usd": 191.82
          }
        ],
        "corte_pantografo": [
          {
            "id": "6af912e9-8ebb-402a-a83d-d555131ef423",
            "nombre": "Corte pantógrafo (histórico)",
            "tipo": "",
            "usd_kg": 0.5325,
            "kg": 4260,
            "subtotal_usd": 2268.58,
            "detalle": ""
          }
        ]
      }
    ],
    "negociacion_pct": 0,
    "neg_modo": "pct",
    "negociacion_usd": 0,
    "interes_pct": 0,
    "interes_dias": 30,
    "tc": null,
    "origen_historico": "7af7d584-b534-4b8b-8486-23fcb0f27f64",
    "created_at": "2026-07-31T21:50:37.807623Z",
    "updated_at": "2026-07-31T21:50:37.807623Z"
  }
];
