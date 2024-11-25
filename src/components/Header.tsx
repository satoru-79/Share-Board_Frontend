import { Link} from 'react-router-dom';



//ヘッダー コンポーネント
const Header = () => {


   
  const width = window.innerWidth;
 

  return (
  <div className="App bg-blue-950" >
    <header className="w-full bg-header h-14 flex justify-between items-center">
      <Link to={'/'}
            className="flex ml-2 h-12 btn"
      >
        <div className="h-full aspect-square">
          <img src='images/shareboard-icon.png' alt='' className='h-full w-full' />
        </div>
        <div className="h-full"
             style={{width: width > 650 ? 350 : 0}}
        >
          <img src="images/title.png" alt="" className="h-full w-full" />
        </div>
      </Link>
    </header>
  </div>  
  )
}

export default Header


  
  
  
  
  