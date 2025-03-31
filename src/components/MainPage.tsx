export default function MainPage() {
  return (
    <section className="flex flex-col h-[656px] bg-center bg-no-repeat bg-[url('/hero.webp')]">
      <div className="bg-black/30 h-full flex flex-col justify-around items-center p-40 text-center">
        <h1 className="text-7xl text-white font-bold">Conecta, viaja y escala</h1>
        <p className="uppercase text-white text-2xl font-semibold">
          Conecta con escaladores apasionados, conoce nuevos sectores de la mano de locales expertos, siéntete como en casa en sectores desconocidos y vive una aventura única.
        </p>
        <a className="bg-(--color-accent) px-4 py-2 rounded-2xl text-white transition transform md:hover:-translate-y-1 duration-100 ease-in-out" href="/login">Únete ya</a>
      </div>
    </section>
  )
}