import '../App.css'
import Modal from 'react-modal';
import { FormEvent, useState, useEffect, SetStateAction } from 'react';
import ClearIcon from '@mui/icons-material/Clear'
import { Player } from '../Board';
import { BoardData } from '../Home';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';


type Props = {
    players: Player[],
    player: Player,
    setCurrentBoard: React.Dispatch<SetStateAction<BoardData>>,
    currentBoard: BoardData,
    side: 'home' | 'away'
}

//プリセットの状態を制御するコンポーネント
const Preset:React.FC<Props> = (props) => {

    const [editModalIsOpen, setEditModalIsOpen] = useState(false);
    const [editModal2IsOpen, setEditModal2IsOpen] = useState(false);
    
    const [myPreset, setMyPreset] = useState<any>([]);

    const [presetName, setPresetName] = useState('チーム1');

    const username = localStorage.getItem("USERNAME") || ""
    const token = localStorage.getItem("TOKEN")

    const getMyPreset = () => {

       
        axios.get(`${process.env.REACT_APP_BASE_URL}/api/preset?username=${username}`,{
            headers : {
                Authorization: `Bearer ${token}`, 
            },
        })
        .then(response => {
            response.data.map((preset:any) => {
                preset.players = JSON.parse(preset.players)
            })
            setMyPreset(response.data);
            setEditModalIsOpen(false);
        })
        .catch(error => {
            console.error(error);
        });
    
        
    }

    useEffect(() => {
        getMyPreset();

    },[])

    const makePreset = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        props.players[0].key = "1";
        const newPreset = {
            presetId : uuidv4(),
            title : presetName,
            username : username
        }
        const includedNewPreset = [...myPreset,{...newPreset, players : props.players}]
        setMyPreset(includedNewPreset)
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/preset/create`, {...newPreset, players : JSON.stringify(props.players)},{
            headers : {
                Authorization: `Bearer ${token}`, 
            },
        })
        .then(response => {
            setEditModalIsOpen(false);
        })
        .catch(error => {
            console.error(error);
        });
    }


    const callPreset = (players:Player[]) => {
        players.map((player) => {
            player.color = props.player.color;
            player.side = props.player.side;
        })
        if (props.side === 'home') props.setCurrentBoard({...props.currentBoard,homePlayers: players});
        else props.setCurrentBoard({...props.currentBoard, awayPlayers: players})
        setEditModal2IsOpen(false);
    }

    const deletePreset = (presetId:string) => {
        const newPreset = myPreset.filter((preset:any) => preset.presetId !== presetId)
        setMyPreset(newPreset)

        axios.post(`${process.env.REACT_APP_BASE_URL}/api/preset/delete?presetId=${presetId}`,{},{
            headers : {
                Authorization: `Bearer ${token}`, 
            },
        })
        .then(response => {
            setEditModalIsOpen(false);
        })
        .catch(error => {
            console.error(error);
        })
        
    }
    

    return (
        <div className='flex flex-col mx-auto justify-between mt-3'>
            <div className='flex h-6 justify-start'
            >
              <p className='font-black mr-4'>・プリセットを管理</p>  
            </div>
            <div className='flex flex-row justify-around mt-2 w-[90%] mx-auto'>
              <div className='drawerButton w-[30%] text-center'>
                 <p 
                    onClick={() => {
                        setEditModalIsOpen(true);
                        setEditModal2IsOpen(false);
                    }}
                 >
                    登録
                </p>
              </div>
              <Modal 
                isOpen={editModalIsOpen}
                onRequestClose={() => setEditModalIsOpen(false)}
                ariaHideApp={false} 
                style={{
                    overlay: {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      zIndex: 900
                    },
                    content: {
                      position: 'absolute',
                      top: '35%',
                      left: '30%',
                      right: '30%',
                      bottom: '35%',
                      border: '1px solid #ccc',
                      background: 'white',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '4px',
                      outline: 'none',
                      padding: '15px',
                    }
                }}
            >          
                <div className="h-full">
                    <div className="h-8 flex items-center justify-between">
                        <div className='h-full aspect-square hover:bg-slate-300 flex 
                                        items-center justify-center rounded-full btn'
                        >
                            <ClearIcon onClick={() => {setEditModalIsOpen(false)}} 
                                       className='h-full'
                            />
                        </div>   
                        <div className="">
                            <p className="font-black text-xl">
                                プリセットを登録する
                            </p>
                        </div>
                        <div className="h-full aspect-square"></div>
                    </div>
                    <form className="flex flex-col justify-between my-5 h-3/4 "
                          onSubmit={(e) => makePreset(e)}
                    >
                        <div  className="flex flex-col items-center w-full ">
                            <p className="font-black mb-1">プリセットの名前</p>
                            <input type="text" onChange={(e) => setPresetName(e.target.value)}
                                   className="bg-slate-200 rounded-[5px] w-2/3 py-1 px-1"
                                   placeholder="プリセットの名前を入力"
                                   defaultValue='チーム1'
                            />
                        </div>
                        <div  className="flex flex-col items-center w-full ">
                            <input type="submit" value='保存'
                                   className="drawerButton"
                            />
                        </div>
                    </form>
                </div>
            </Modal>
              <div className='drawerButton w-[50%] text-center'>
                <p onClick={() => {
                    setEditModal2IsOpen(true);
                    setEditModalIsOpen(false);
                    getMyPreset();
                   }}
                >
                    呼び出す
                </p>
              </div>
              <Modal 
                isOpen={editModal2IsOpen}
                onRequestClose={() => setEditModal2IsOpen(false)}
                ariaHideApp={false} 
                style={{
                    overlay: {
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.75)',
                      zIndex: 900
                    },
                    content: {
                      position: 'absolute',
                      top: '20%',
                      left: '30%',
                      right: '30%',
                      bottom: '20%',
                      border: '1px solid #ccc',
                      background: 'white',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '4px',
                      outline: 'none',
                      padding: '15px',
                    }
                }}
            >          
                <div className="h-full">
                    <div className="h-8 flex items-center justify-between">
                        <div className='h-full aspect-square hover:bg-slate-300 flex 
                                        items-center justify-center rounded-full btn'
                        >
                            <ClearIcon onClick={() => {setEditModal2IsOpen(false)}} 
                                       className='h-full'
                            />
                        </div>   
                        <div className="">
                            <p className="font-black text-xl">
                                プリセットを呼び出す
                            </p>
                        </div>
                        <div className="h-full aspect-square"></div>
                    </div>
                    <div className="flex flex-col justify-start my-5 h-3/4 w-3/4 mx-auto overflow-scroll">
                        {myPreset.map((data:any,index:number) => {
                            return (
                                <div className='flex flex-row justify-between items-center hover:bg-slate-300 btn border border-slate-400 py-1'
                                     key={index}
                                >
                                    <p className='w-[85%] flex justify-center font-semibold hover:'
                                       onClick={() => callPreset(data.players)}
                                    >
                                        {data.title}
                                    </p>
                                    <div className='w-[15%] drawerButton text-center'
                                         onClick={() => deletePreset(data.presetId)}
                                    >
                                        <p>削除</p>
                                    </div>
                                </div>    
                            )
                        })}
                    </div>
                </div>
            </Modal>
            </div>

        </div>    
        
    )

}

export default Preset