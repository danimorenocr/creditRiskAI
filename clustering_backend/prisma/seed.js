const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.cluster.createMany({
    data: [
      { id: 0,  perfilPromedio: 'Ingresos > prom., educación baja',             riesgo: 'Medio-Bajo', estrategiaMkt: 'Créditos pequeños + asesoría' },
      { id: 1,  perfilPromedio: 'Ingresos muy bajos, educación alta',            riesgo: 'Alto',       estrategiaMkt: 'Microcréditos, productos básicos' },
      { id: 2,  perfilPromedio: 'Ingresos bajos, estabilidad moderada',          riesgo: 'Medio',      estrategiaMkt: 'Educación financiera, control crédito' },
      { id: 3,  perfilPromedio: 'Ingresos altos, edad estable',                  riesgo: 'Bajo',       estrategiaMkt: 'Hipotecarios, inversión' },
      { id: 4,  perfilPromedio: 'Ingresos moderados, estables',                  riesgo: 'Medio',      estrategiaMkt: 'Créditos medianos' },
      { id: 5,  perfilPromedio: 'Score bajo, intereses altos',                   riesgo: 'Alto',       estrategiaMkt: 'Refinanciación, evitar montos grandes' },
      { id: 6,  perfilPromedio: 'Ingresos estables, score aceptable',            riesgo: 'Medio-Bajo', estrategiaMkt: 'Préstamos moderados' },
      { id: 7,  perfilPromedio: 'Ingresos bajos, educación moderada',            riesgo: 'Medio',      estrategiaMkt: 'Créditos básicos' },
      { id: 8,  perfilPromedio: 'Jóvenes, ingresos bajos, educación baja',       riesgo: 'Alto',       estrategiaMkt: 'Microcréditos + educación financiera' },
      { id: 9,  perfilPromedio: 'Ingresos moderados, score estable',             riesgo: 'Medio',      estrategiaMkt: 'Créditos medianos' },
      { id: 10, perfilPromedio: 'Score aceptable, educación baja',               riesgo: 'Medio',      estrategiaMkt: 'Productos básicos, evitar montos altos' },
      { id: 11, perfilPromedio: 'Ingresos muy bajos, educación negativa',        riesgo: 'Alto',       estrategiaMkt: 'Riesgo elevado, refinanciación' },
      { id: 12, perfilPromedio: 'Score bajo, educación muy baja',                riesgo: 'Alto',       estrategiaMkt: 'Campañas preventivas, microcréditos' },
      { id: 13, perfilPromedio: 'Jóvenes, educación baja',                       riesgo: 'Medio-Alto', estrategiaMkt: 'Educación financiera, control crédito' },
      { id: 14, perfilPromedio: 'Ingresos estables, educación alta',             riesgo: 'Bajo',       estrategiaMkt: 'Premium, préstamos grandes' },
      { id: 15, perfilPromedio: 'Ingresos bajos, educación alta',                riesgo: 'Moderado',   estrategiaMkt: 'Tarjetas estudiantiles, microcréditos' },
    ],
    skipDuplicates: true, // evita errores si ya existen
  });

  console.log('✅ Clusters insertados correctamente');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
