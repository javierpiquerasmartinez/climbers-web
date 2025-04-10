export default function MainPage() {

  const items = [
    {
      id: 1,
      icon: '/icons/communication.svg',
      title: 'Conecta',
      description: 'Conoce escaladores apasionados y comparte experiencias únicas.',
    },
    {
      id: 2,
      icon: '/icons/plane.svg',
      title: 'Viaja',
      description: 'Descubre nuevos sectores de escalada con la ayuda de locales expertos.',
    },
    {
      id: 3,
      icon: '/icons/navigation.svg',
      title: 'Escala',
      description: 'Siente la adrenalina de escalar en lugares desconocidos y vive una aventura única.',
    }
  ]

  const articlesList = [
    {
      title: 'Explora sin barreras',
      content: 'Imagina viajar a los mejores sectores del mundo aconsejado, guiado y acompañado por un local. En CragXchange, encontrarás una comunidad de escaladores dispuestos a compartir su mundo contigo'
    },
    {
      title: 'Conecta con la comunidad',
      content: 'Desde rutas épicas hasta secretos locales, haz que cada viaje sea más auténtico de la mano de anfitriones que comparten tu misma pasión. Aquí no solo escalas paredes, ¡construyes amistades que duran toda la vida!'
    },
    {
      title: 'Escala más, preocúpate menos',
      content: 'Céntrate en lo que realmente importa: disfrutar del deporte que amas en el sector que siempre has querido visitar. Esta comunidad está para ayudarte a vivir el momento.'
    },
    {
      title: 'Una red global sin fronteras',
      content: 'España, Italia, Estados Unidos, ¡el mundo entero te espera! Descubre nuevos destinos y culturas mientras haces lo que más te gusta.'
    }
  ]


  return (
    <>
      <section className="relative flex flex-col min-h-[656px] w-auto bg-center bg-cover bg-no-repeat bg-[url('/hero.webp')]">
        <div className="absolute bg-black/30 justify-around items-center text-center h-full w-full flex flex-col px-10">
          <div className="flex flex-col gap-10 max-w-3xl">
            <h1 className="text-7xl text-white font-bold">Conecta, viaja y escala</h1>
            <p className="uppercase text-white text-2xl font-semibold">
              Conecta con escaladores apasionados, conoce nuevos sectores de la mano de locales expertos, siéntete como en casa en sectores desconocidos y vive una aventura única.
            </p>
          </div>
          <a className="bg-(--color-accent) px-4 py-2 rounded-2xl text-white transition transform md:hover:-translate-y-1 duration-100 ease-in-out" href="/login">Únete ya</a>
        </div>
      </section>
      <section className="flex flex-col md:flex-row justify-around items-center bg-(--color-accent) md:gap-10 px-10">
        {
          items.map((item) => (
            <div key={item.id} className="flex-1 flex flex-col items-center py-6 md:py-10 text-center gap-4">
              <img className="size-20" src={item.icon} alt={`Un logo de ${item.title}`} />
              <h2 className="text-3xl font-bold text-white">{item.title}</h2>
              <p className="text-white text-lg">{item.description}</p>
            </div>
          ))
        }
      </section>
      <section className="px-10 py-20 flex flex-col items-center gap-15">
        <article className="flex flex-col items-center text-center gap-6 max-w-6xl">
          <h2 className="text-3xl font-semibold">¿Listo para llevar tu pasión por la escalada más allá de tus límites?</h2>
          {
            articlesList.map((article) => (
              <article className="flex flex-col items-center gap-2">
                <h4 className="text-xl font-medium">{article.title}</h4>
                <p>{article.content}</p>
              </article>
            ))
          }
        </article>
        <button className="px-4 py-2 rounded-sm text-white bg-primary">Cómo funciona</button>
      </section>
    </>
  )
}