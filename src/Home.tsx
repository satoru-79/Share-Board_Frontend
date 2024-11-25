import { useState, useEffect,createContext, useContext, SetStateAction } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Player, ArrowObject } from './Board';
import BoardList from './components/BoardList';
import axios from 'axios';
import ShareIcon from '@mui/icons-material/Share';
import ThumbUpAltSharpIcon from '@mui/icons-material/ThumbUpAltSharp';
import HomeSharpIcon from '@mui/icons-material/HomeSharp';



export type BoardData = {
    homePlayers: Player[],    
    awayPlayers: Player[],
    arrows: ArrowObject[],
    court: 0 | 1,
    ballPosition: {x:number, y:number},
    comment: string
}

export type BoardObject = {
    boards:BoardData[],
    boardId:string,
    userName: string | null,
    title: string,
    boardType: BoardType,
    ispublic: 0 | 1,
    goods: string[]
}

export type BoardType = "オフェンス" | "ディフェンス" | "その他"

type Props = {
    user: String
    setUserName: React.Dispatch<SetStateAction<string>>
}


export const BoardContext = createContext<any>({});



//認証完了後のホーム画面
const Home:React.FC<Props> = (props) => {

    //ユーザーで絞り込むためのstate
    const [endPoint, setEndPoint] = useState("");

    //公開された全てのボードデータを新着順に格納するstate
    const [defaultBoards, setDefaultBoards] = useState<any>([]);

    //作成したボードのデータを格納するstate
    const [myBoards, setMyBoards] = useState<any>([]);


    //作成したボード / 保存したボード の画面の切り替えを管理するstate
    const [active, setActive] = useState<number>(0);

     //保存したボードのデータを格納するstate
    const [goodedBoards, setGoodedBoards] = useState<BoardObject[]>([]);

    const username = localStorage.getItem("USERNAME") || ""

    const token = localStorage.getItem("TOKEN") || ""

    const [searchParams] = useSearchParams();

    const param = searchParams.get('user') || ""
      
    function signOut() {
        localStorage.setItem("USERNAME", "");
        localStorage.setItem("TOKEN","");
        props.setUserName("");
    }



    //クエリパラメータが変わるたびに更新
    async function getBoardData(endPoint:String){

        //クエリパラメータが空の時はDBからすべてのデータを取得する
        //そうでないときは、クエリパラメータに等しいユーザー名のボードをもってくる　
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/board/${endPoint}?username=${param}`,{
            headers : {
                Authorization: `Bearer ${token}`, 
            },
        })
         .then(response => {
             const parsedData:any = []
             response.data.forEach((board:any) => {
                 parsedData.push({
                     boards:JSON.parse(board.boards),
                     boardId:board.boardId,
                     userName: board.userName,
                     title: board.title,
                     boardType: board.boardType,
                     ispublic: board.ispublic,
                     goods: JSON.parse(board.goods)
                 })
             })
             const publicBoards = parsedData.filter((board:BoardObject) => board.ispublic == 1)
             setDefaultBoards(publicBoards)
             setMyBoards(parsedData.filter((data:BoardObject) => data.userName == username))
             setGoodedBoards(publicBoards.filter((data:BoardObject) => data.goods.includes(username)))
         })
         .catch(error => {
             if (error.response.status === 401) {
                signOut()
             }
         });
        
    }



    //クエリパラメータ更新毎に実行する
    useEffect(() => {
        const end_point = param == "" ? "get" : "filter-by-username"
        setEndPoint(end_point)
        getBoardData(end_point)
    },[param])




    return (
        <BoardContext.Provider 
            value={{setActive,myBoards,setMyBoards,defaultBoards,setDefaultBoards}}
        >
            <div className='absolute right-[10px] top-2 h-10 w-[130px] text-center'
             onClick={() => signOut()}
            >
                <p className='signInButton'>
                    サインアウト
                </p>
            </div> 
            <div className='px-3 bg-white'>
            <div className='flex flex-row h-16 w-full justify-between py-6 items-center'>
                { param == "" ? 
                <>
                    <div className='flex flex-row gap-2 '>
                        <p className='flex items-center font-black '>ユーザー :</p>
                        <div className='flex flex-row  py-1 px-4 justify-around'>
                            <p className='flex items-center font-black text-xl'>{props.user}</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                        {<Link className='btn hover:opacity-70' to={`/auth/create_board?user=${props.user}`}
                                state={{
                                    board: null,
                                }}
                            >
                            <div className='px-3 py-2 bg-blue-500 rounded-full mb-1'>
                                <p className='font-black text-white'>+ ボードを作成</p>
                            </div>
                                </Link>
                        }
                        <Link to={'/information'}>
                            <p className='py-2 px-4 border border-silver text-white rounded-full bg-black btn
                                        hover:text-black hover:bg-white hover:border-black'
                            >
                                ?　ボードの使いかた
                            </p>
                        </Link>
                    </div>
                </>
                :
                <div className='flex w-full'>
                    <p className="font-black border-b-2 border-black text-xl w-full">
                    {param}
                     の作成したボード
                    </p>
                </div>
                }
            </div>
            <div className='flex flex-col w-full my-8'>

                { //----------------------------------//
                  // share / my / saved を切り替えるTab //
                  //----------------------------------//
                <div className='w-full flex justify-around px-5 py-3 mb-5 items-end'>
                    <div className='w-[33%] flex justify-center'>
                        <p className='font-black select-none btn'
                        style={{fontSize: active === 0 ? 30 : 24,
                                color: active === 0 ? 'black' : 'silver',
                                borderBottom: active === 0 ? '2px solid black' : '2px solid silver' 
                        }}
                        onClick={() => setActive(0)}
                        >
                            <ShareIcon sx={{marginRight : 2}}/>
                            Shared
                        </p>
                    </div>
                    <div className='w-[33%] flex justify-center'>
                        <p className='font-black btn select-none'
                        style={{fontSize: active === 1 ? 30 : 24,
                                color: active === 1 ? 'black' : 'silver',
                                borderBottom: active === 1 ? '2px solid black' : '2px solid silver' 
                                }}
                            onClick={() => setActive(1)}
                        >
                            <HomeSharpIcon sx={{marginRight : 2}}  />
                            Created
                        </p>
                    </div>
                    <div className='w-[33%] flex justify-center'>
                        <p className='font-black btn select-none'
                        style={{fontSize: active === 2 ? 30 : 24,
                                color: active === 2 ? 'black' : 'silver',
                                borderBottom: active === 2 ? '2px solid black' : '2px solid silver' 
                                }}
                        onClick={() => setActive(2)}
                        >
                            <ThumbUpAltSharpIcon sx={{marginRight: 2}}/>
                            Gooded
                        </p>
                    </div>
                </div>

                 // Tab end
                }
                
                { active === 0 ? // share 選択時のboardlist
                <BoardList defaultBoards={defaultBoards} 
                        name='share'
                        displayBoards={defaultBoards}
                />
                : active === 1 ? // my 選択時のboardlist
                <BoardList defaultBoards={defaultBoards} 
                        name='own'
                        displayBoards={myBoards}
                />
                :   // saved 選択時のboardlist
                <BoardList defaultBoards={defaultBoards} 
                        name='save'
                        displayBoards={goodedBoards}
                />
                }
            </div>
        </div>
        </BoardContext.Provider>
        )
}
           
export default Home