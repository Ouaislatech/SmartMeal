import ProgrammeCard from '../components/ProgrammeCards';

export default function ProgrammeCards() {
  const programmes = [
    {
      title: 'Programme Semaine 1',
      description: 'Des repas adaptés à votre régime sans gluten et votre objectif minceur.',
      image: '/images/programmes/marche-fruits-legumes.jpg',
    },
    {
      title: 'Programme Semaine 2',
      description: 'Une alimentation équilibrée pour une meilleure santé.',
      image: '/images/programmes/assiette-saine.jpg',
    },
    {
      title: 'Programme Semaine 3',
      description: 'Découvrez de nouvelles recettes saines et savoureuses.',
      image: '/images/programmes/ingredients-frais.jpg',
    },
    {
      title: 'Programme Semaine 4',
      description: 'Un programme complet pour maintenir une alimentation saine.',
      image: '/images/programmes/repas-equilibre.jpg',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Mes Programmes de Repas</h1>
        <div className="space-y-8">
          {programmes.map((programme, index) => (
            <ProgrammeCard
              key={index}
              title={programme.title}
              description={programme.description}
              image={programme.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
