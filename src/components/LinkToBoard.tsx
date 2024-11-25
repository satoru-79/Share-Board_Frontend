import '../App.css'
import { Link } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react';
import { BoardObject } from '../Home';
import AnnounceModal from './AnnounceModal'
import { BoardContext } from '../Home';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import axios from 'axios';


type Props = {
    board:BoardObject,
    index:number,
    type: 'share' | 'own' | 'save' ,
}


//ボードへのリンク部分コンポーネント
const LinkToBoard:React.FC<Props> = (props) => {

    const {setActive,myBoards,setMyBoards,defaultBoards,setDefaultBoards} = useContext(BoardContext);


    //いいね済みかどうかを切り替えるstate
    const [gooded, setGooded] = useState(false)

    const [goodCount, setGoodCount] = useState(0)

    const username = localStorage.getItem("USERNAME")

    const token = localStorage.getItem("TOKEN")



    //最初のrender時にのみ更新
    useEffect(() => {
        if (username !== null) {
            if (props.board.goods.indexOf(username) >= 0) {
                setGooded(true)
            } else {
                setGooded(false)
            }
        }
        setGoodCount(props.board.goods.length)
    },[props.board])



    //「削除」ボタン押下時にそのボードをDBから削除する関数
    const deleteBoard = () => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/board/delete?boardId=${props.board.boardId}`,{},{
            headers : {
                Authorization: `Bearer ${token}`, 
            },
        })
        .then((response) => {
        })
        .catch((error) => {
            console.error(error.response.data)
        })
        setMyBoards(myBoards.filter((board:BoardObject, index:number) => board.boardId !== props.board.boardId));
        setDefaultBoards((defaultBoards.filter((board:BoardObject) => board.boardId !== props.board.boardId)))
    }


    //DBとuiのいいね状態を変更する関数
    const changeGooded = () => {
        let goods = props.board.goods
        let newGoods;
        if (username != null) {
            if (gooded) {
                newGoods = goods.filter((good) =>  good !== username)
                setGooded(false);
                setGoodCount(goodCount - 1)
            } else {
                newGoods = [...goods,username]
                setGooded(true);
                setGoodCount(goodCount + 1)
            }
        }

        const newData = {
            boards: JSON.stringify(props.board.boards),
            boardId: props.board.boardId,
            userName: props.board.userName,
            title: props.board.title,
            boardType: props.board.boardType,
            ispublic: props.board.ispublic,
            goods:  JSON.stringify(newGoods) 
        }
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/board/create`, newData,{
            headers : {
                Authorization: `Bearer ${token}`, 
            },
        })
        .then((response) => {
            
        })
        .catch((error) => {
            console.error(error.response.data)
        })

    }


    if (username !== null) {
    return (
        <div className="rounded-[20px] w-[24%] min-w-[140px] border-2 border-black shadow-md h-[160px] bg-white mr-[0.5%] ml-[0.5%]
                        btn duration-0 flex flex-col items-center justify-start overflow-hidden z-10 hover:border-orange-400 relative"    
             style={{backgroundColor: props.board.boardType === 'オフェンス'   ? 'rgb(220 38 38)' :
                                      props.board.boardType === 'ディフェンス' ? 'rgb(37 99 235)' 
                                                                             : 'rgb(22 163 74)'
             }}               
        >
            <Link to={
                props.type === 'own' ? `/auth/edit_board?key=${props.board.boardId}&user=${localStorage.getItem('USERNAME')}`
                                      : `/auth/view_board?key=${props.board.boardId}`   
                }
                state={{
                    board: props.board
                }} 
                className='h-full w-full'
            >
                <div className='h-full w-full '>
                    <div className='bg-slate-600 h-[50%] w-full flex justify-center'>
                        {props.board.boards[0].court === 0 ?
                            <div 
                                className='bg-orange-400 h-full aspect-[1.4] bg-court-img bg-contain
                                           bg-center bg-no-repeat'
                            >
                            </div>
                        :
                            <div 
                                className='bg-half-court-img h-full aspect-[1.4] bg-contain 
                                           bg-center bg-no-repeat bg-orange-400'
                            >
                            </div>
                
                        }
                    </div>
                    <div className='flex justify-between items-center flex-col text-center w-full h-[30%] flex-nowrap overflow-hidden'>
                        <p className='font-black text-base h-[50%] flex text-white w-full items-center justify-center'>
                            {props.board.title}
                        </p>
                        <div className='flex flex-row w-full h-[50%] justify-center items-center'>
                            { props.type === 'own' && 
                            <p className='font-black text-sm text-white'>
                                {props.board.ispublic == 1 ? '公開中': '非公開'}
                            </p>
                            }
                        </div>
                    </div>
                </div>
            </Link> 
            { props.type !== 'own' &&
                <Link to={`/?user=${props.board.userName}`}
                      className='font-black text-sm text-white hover:border-b border-white absolute top-[65%]'
                      onClick={() => setActive(0)}
                >
                    投稿者 : {props.board.userName}
                </Link>
            }
            {props.type === 'own' ? 
            <div className='h-[15%] flex justify-center gap-4 absolute top-[80%]'>
                <div className='flex items-center gap-1 py-2 px-2 '>
                    <ThumbUpOffAltIcon sx={{height: 20, color:'white'}}/>
                    <p className='text-white '>{props.board.goods.length}</p>
                </div>
                <AnnounceModal buttonValue='削除' action={deleteBoard}/>
            </div>
            :
            <div className='h-[15%] flex justify-center gap-2 absolute top-[80%]'>
                <div className='bg-white flex items-center gap-1 py-2 px-2 border rounded-full btn hover:border-black duration-0'
                    onClick={() => changeGooded()}
                >
                    {
                    gooded ?
                    <ThumbUpAltIcon sx={{height: 20}} />
                    :
                    <ThumbUpOffAltIcon sx={{height: 20}}/>
                    }
                    <p className='text-black '>{goodCount}</p>
                </div>
            </div>
            }
        </div>
    )
    } else {
        return (
            <div>

            </div>    
        )
    }

}


export default LinkToBoard;