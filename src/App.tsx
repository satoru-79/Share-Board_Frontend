import './App.css';
import { Link} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './Home';
import axios from 'axios';


//認証時にHomeコンポーネントを返す関数
function App() {


  const username = localStorage.getItem('USERNAME') || "";

  const [userName, setUserName] = useState("");

  const width = window.innerWidth;

  

  


  useEffect(() => {
    setUserName(username)
  })



  


  return (
    
    <div className="App bg-blue-950" >
      <Header />
      { userName == "" ?
      <div> 
        <Link to={'/signup'}
              className='absolute right-[115px] top-2 h-10 w-[100px] text-center'
        >
          <p className='signInButton'>
            新規登録
          </p>
        </Link> 
        <Link to={'/login'}
              className='absolute right-[10px] top-2 h-10 w-[100px] text-center'
        >
          <p className='signInButton'>
            ログイン
          </p>
        </Link> 
        <div className="App bg-blue-950" >
          <div id='container' >
            <p className='font-black mx-4 py-2 mt-5 pl-5 flex items-center
                          border text-red-500 bg-white'
            >
              ! PC以外でのご利用時は、横向き状態を強く推奨します !
              </p>
            <div className="w-full bg-blue-950 flex items-center justify-center"
                style={{flexDirection: width > 700 ? 'row' :  'column',
                        height: width > 700 ? 480 : undefined,
                        
                }}
            >
              <div className='h-3/5  py-[20px]'
                  style={{width: width > 700 ? 400 : '90%'}}
              >
                <img src="images/sample_court.png" alt="" className='h-full'/>
              </div>
              <div className='w-[350px] h-5/6 flex flex-col justify-center text-white items-center py-[20px]'>
                <h1 className='font-black text-2xl mb-8'>今すぐボードを利用</h1>
                <p className='font-midium w-3/4 mb-8'>シンプルな作戦ボードはサインインなしでも利用できます。</p>
                <Link  to={'/board'} state={{board:null}}
                  
                >
                  <p className='font-black  py-2 px-4 bg-green-500 btn hover:text-green-500  hover:bg-white 
                                border border-green-500'
                  >
                    ボードを使用
                  </p>
                </Link>
                <Link to={'/information'}>
                  <p className='mt-5 py-2 px-4 rounded-full bg-black btn
                                hover:text-black hover:bg-white hover:border-black'
                  >
                    ?　ボードの使いかた
                  </p>
                </Link>
              </div>
            </div>
            <div className="w-full bg-slate-300 flex items-center justify-center"
                style={{flexDirection: width > 700 ? 'row' : 'column' ,
                        height: width > 700 ? 520 : undefined
                }}
            >
              <div className='w-[350px] h-[400px] flex flex-col justify-center text-white items-center '>
                <h1 className='font-black text-2xl mb-5 text-black'>ログインすると・・・</h1>
                <p className='font-midium w-3/4 mb-5 text-black'>ボードや駒の状態を保存したり、作成したボードをシェアすることができます</p>
                <Link to={'/login'}>
                  <p className='signInButton'>
                      ログイン
                  </p>
                </Link>
              </div>
              <div className='h-[200px] bg-white pb-[20px] mb-3'
                  style={{width: width > 700 ? 400 : '90%'}}
              >
                <img src="images/home.png" alt="" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
     
      :
      <div>
        <Home user={userName} setUserName={setUserName}/>
      </div>
      }
    </div>  
  );
}

export default App;

