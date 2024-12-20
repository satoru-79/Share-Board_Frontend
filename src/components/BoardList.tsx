import LinkToBoard from "./LinkToBoard";
import { BoardObject } from "../Home";
import { useState, useEffect, SetStateAction } from "react";
import { v4 as uuidv4} from "uuid";

type Props = {
    displayBoards: BoardObject[],
    defaultBoards: BoardObject[],
    name: 'own' | 'share' | 'save' 
}

const BoardList:React.FC<Props> = (props) => {

    //実際に表示するボードを格納するstate
    const [displayBoards, setDisplayBoards] = useState<BoardObject[]>([]);

    //ボードデータを評価順に格納するstate
    const [filterByGoodedBoards, setFilterByGoodedBoards] = useState<BoardObject[]>([]);

    const [searchKey, setSearchKey] = useState("");
   


    useEffect(() => {
        const copyBoards = [...props.displayBoards]
        setFilterByGoodedBoards(copyBoards.sort((a:any,b:any) => b.goods.length - a.goods.length));
        setDisplayBoards(props.displayBoards);
        console.log(props.displayBoards)
        
    },[props.displayBoards])

    //絞り込みの状態を記憶するstate
    const [filter, setFilter] = useState("");

    //ソートの状態を記憶するstate
    const [sort, setSort] = useState("new");

    //絞り込みを実行する関数
    const ChangeBoard = (filter:string, sort:string) => {
        let newBoard = [...props.displayBoards]
        if (sort === "good") newBoard = [...filterByGoodedBoards];
        if (filter !== "") setDisplayBoards(newBoard.filter((board:BoardObject) => board.boardType === filter))
        else setDisplayBoards(newBoard);
        setFilter(filter);
        setSort(sort);
    }

    //ID検索を実行する関数
    const searchBoard = (e:any) => {
        e.preventDefault();
        const boards = [...props.defaultBoards]
        setDisplayBoards(boards.filter((board) => board.boardId === searchKey))
    }

    return (
        <div className='bg-blue-950 w-full rounded-t-2xl rounded-b-2xl border-2 border-blue-950'>
            <div className='w-full bg-slate-300 flex flex-col justify-center px-3 gap-y-2 rounded-t-2xl'>
                <div className='h-[17%] w-full flex justify-center'>
                    <div className='h-3 aspect-[4] bg-white rounded-full border border-black mt-2'></div>
                </div>
                <div className='flex flex-row gap-3'>
                    <p className='font-bold'>絞り込み</p>
                    <div className='flex flex-row gap-1'>
                        <input type="radio" defaultChecked id={`${props.name}-default`} name={props.name}
                               onChange={() => {
                                  ChangeBoard("",sort);
                               }}
                        />
                        <label htmlFor={`${props.name}-default`}>なし</label>
                    </div>
                    <div className='flex flex-row gap-1'>
                        <input type="radio" id={`${props.name}-offence`} name={props.name}
                               onChange={() => ChangeBoard('オフェンス',sort)}
                        />
                        <label htmlFor={`${props.name}-offence`}
                        >オフェンス</label>
                    </div>
                    <div className='flex flex-row gap-1'>
                        <input type="radio" id={`${props.name}-defence`} name={props.name}
                               onChange={() => ChangeBoard('ディフェンス',sort)}
                        />
                        <label htmlFor={`${props.name}-defence`}>ディフェンス</label>
                    </div>
                    <div className='flex flex-row gap-1'>
                        <input type="radio" id={`${props.name}-others`} name={props.name}
                               onChange={() => ChangeBoard("その他",sort)}
                        />
                        <label htmlFor={`${props.name}-others`}>その他</label>
                    </div>
                </div>
                <div className='flex flex-row gap-3 '>
                    <p className='font-bold'>ソート</p>
                    <div className='flex flex-row gap-1'>
                        <input type="radio" id={`${props.name}-newest`} name={`${props.name}2`} defaultChecked
                               onChange={() => {
                                   ChangeBoard(filter,"new")
                               }}
                        />
                        <label htmlFor={`${props.name}-newest`}>新着順</label>
                    </div>
                    <div className='flex flex-row gap-1'>
                        <input type="radio" id={`${props.name}-rated`} name={`${props.name}2`}
                               onChange={() => {
                                   ChangeBoard(filter,'good')
                               }}
                        />
                        <label htmlFor={`${props.name}-rated`}>評価順</label>
                    </div>
                </div>
                <div className='flex flex-row gap-3 pb-3  items-center w-[100%]'>
                    <p className='font-bold'>ID検索</p>
                    <form action=""
                          onSubmit={(e) => searchBoard(e)}
                          className="w-1/3"
                    >
                        <input type="text" className="rounded-l-md py-1 px-2 w-[70%]"
                               onChange={(e) => setSearchKey(e.target.value)}
                        />
                        <input type="submit" value="検索" className="bg-slate-200 btn hover:opacity-70 px-2 py-1 rounded-r-md"/>
                    </form>
                </div>
            </div>
            <div className='w-full p-3 border-blue-950 bg-blue-950 h-[100vh] overflow-scroll rounded-b-2xl'
            >
                <div className='flex flex-row justify-start flex-wrap gap-y-3'>
                    {displayBoards.map((board:BoardObject,index:number) => {
                        return(
                            <LinkToBoard board={board} index={index}
                                         type={props.name} 
                                         key={index}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )

}

export default BoardList