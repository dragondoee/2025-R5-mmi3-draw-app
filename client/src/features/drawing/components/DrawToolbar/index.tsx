import styles from './DrawToolbar.module.css';

export function DrawToolbar() {
  return (
    <div className={styles.toolbar}>
      {/* Choix des couleurs statique - non fonctionnel */}
      <div className='bg-base-100 p-2 rounded-md flex flex-col gap-2 shadow-md'>
        <p>Couleur du trait :</p>
        <div>
          <ul className='flex gap-2'>
            <li><button className='btn bg-neutral-950 size-7 rounded-full border-solid border-2 border-blue-500'></button></li>
            <li><button className='btn bg-red-500 size-6 rounded-full'></button></li>
            <li><button className='btn bg-orange-500 size-6 rounded-full'></button></li>
            <li><button className='btn bg-yellow-500 size-6 rounded-full'></button></li>
            <li><button className='btn bg-green-500 size-6 rounded-full'></button></li>
            <li><button className='btn bg-blue-500 size-6 rounded-full'></button></li>
            <li><button className='btn bg-pink-500 size-6 rounded-full'></button></li>
            <li><button className='btn bg-purple-500 size-6 rounded-full'></button></li>
          </ul>
        </div>
      </div>
      {/* Choix épaisseur du trait static - non fonctionnel */}
      <div className='bg-base-100 p-2 rounded-md flex flex-col gap-2 shadow-md'>
        <p>Épaisseur du trait :</p>
        <div className='flex gap-2'>
          <input type="range" min="1" max="100"/>
        </div>
      </div>
    </div>
  )
}