import List from './List';
import TemplateList from './TemplateList';

function page() {
  return (
    <div className='container mx-auto px-4'>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-[26px] gap-y-[48px] p-4"'>
        <List imageUrl={`/assets/images/room01.jpg`} title='Bedroom 🛏️' />
        <List imageUrl={`/assets/images/room02.jpg`} title='내 방 꾸미기 ✨' />
        <List imageUrl={`/assets/images/room03.jpg`} title='이사 가자 🏠' />
        <List imageUrl={`/assets/images/room04.jpg`} title='게이밍 침실' />
        <List imageUrl={`/assets/images/room05.jpg`} title='작업 공간' />
        <List
          imageUrl={`/assets/images/room06.jpg`}
          title='깔끔하고 고급스러운 침실'
        />
      </ul>

      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[26px] gap-y-[48px] max-w-[1200px] mx-auto'>
        <TemplateList />
        <TemplateList imageUrl={`/assets/images/room02.jpg`} />
        <TemplateList imageUrl={`/assets/images/room03.jpg`} />
        <TemplateList imageUrl={`/assets/images/room04.jpg`} />
        <TemplateList imageUrl={`/assets/images/room05.jpg`} />
        <TemplateList imageUrl={`/assets/images/room06.jpg`} />
      </section>
    </div>
  );
}
export default page;
