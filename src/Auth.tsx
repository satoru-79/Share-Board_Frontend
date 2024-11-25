import { useState } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import Header from './components/Header';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import DoneIcon from '@mui/icons-material/Done';

type Props = {
    role: "ログイン" | "新規登録"
}

type Message = {
    message : String,
    type : "error" | "success" | ""
}

type Validation = (input:any[]) => Boolean


export const validationForXSS: Validation = (input) => {
    for (let i = 0; i < input.length; i++) {
        if (input[i].includes("<script>") || input[i].includes("javascript:")) {
            alert("不正な入力が検出されました")
            return true
        }
    }

    return false
    
}

//ログイン、新規登録時の画面
const Auth:React.FC<Props> = (props) => {

    //ユーザー名
    const [name, setName] = useState("");

    //パスワード
    const [password, setPassword] = useState("");

    //サインアップ成功時やエラー時に表示するメッセージを管理するstate
    const [message, SetMessage] = useState<Message>({message:"", type: ""})
    const navigate = useNavigate();

    //ログイン処理
    const logIn= (name:string, password:string) => {

        if (validationForXSS([name,password])) {
            return;
        }

        const params = {
          username: name,
          password: password
      }
    
      //ログイン後のデータ受け取り
      axios.post(`${process.env.REACT_APP_BASE_URL}/api/public/login`,params)
        .then(response => {
            console.log(response.data); 
            //失敗時の処理
            if (response.data === "") {
                SetMessage({message: "入力エラーです", type: "error"});
            
            //成功時の処理
            } else {
                SetMessage({message: "" , type: ""});
                localStorage.setItem("TOKEN" , response.data)
                localStorage.setItem("USERNAME",params.username)
                navigate('/');
            }
        })
        .catch(error => {
          console.error(error);
        });
      }

      //ユーザー登録処理
      const signUp = (name:String, password:String) => {

        if (validationForXSS([name,password])) {
            return;
        }
  
        const params = {
          username: name,
          password: password
        }
    
        axios.post(`${process.env.REACT_APP_BASE_URL}/api/public/signup`, params)
        .then(response => {
            console.log(response)
           if (response.data === "existUserName") {
                SetMessage({message : "すでに登録されているユーザー名です", type: "error"})
            } else if(response.data === "success"){
                SetMessage({message : "ユーザーを登録しました" , type : "success"})
            } else {
                SetMessage({message : response.data, type : "error"})
            }
            
        })
        .catch(error => {
            console.error(error);
        });
      }

    return (
        <div className='h-[100vh] w-full flex flex-col items-center'>
            <div className='w-[100vw]'>
                <Header />
            </div>
            <div className="h-full w-[80%] max-w-[700px] mt-[3%]">
                <div className="flex items-center justify-between">
                    { message.type === "error"  ?
                        <div className='flex flex-row h-full bg-red-200 px-2 py-2 items-center border border-red-500 w-[100%] justify-center'>
                            <WarningIcon sx={{color:"red"}}/>
                            <p className='text-red-500'>{message.message}</p>
                        </div>
                    : message.type === "success" &&
                        <div className='flex flex-row h-full bg-green-200 px-2 py-2 items-center border border-green-500 w-[100%] justify-center'>
                            <DoneIcon sx={{color:"green"}}/>
                            <p className='text-green-500'>{message.message}</p>
                        </div>
                    }
                </div>
                <div className='h-[10%] flex justify-center mt-4'>
                    <div className='h-full aspect-square'>
                        <img src='images/shareboard-icon.png' alt='' className='h-full w-full' />
                    </div>  
                </div>
                <div className='h-[50%] w-full mt-[10%]'
                     id='form-area'
                >
                    <div className='w-full flex justify-center'>
                        <p className='font-bold text-xl'>{props.role}</p>
                    </div>
                    <form action="" method='post'
                        className='h-full w-full flex items-center flex-col'
                        onSubmit={(e) => {
                            e.preventDefault();
                            {props.role === "ログイン" ?
                            logIn(name, password)
                            :
                            signUp(name, password)
                            }
                        }}
                    >
                        <div className='w-full h-1/4 mt-3 flex flex-col justify-center'>
                            <label htmlFor="username" className='font-bold'>
                                ユーザー名:
                                </label>
                            <input id='username' type="text" name='username'
                                   
                                className='w-full border border-black rounded-md'
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='w-full h-1/4 mt-3 flex flex-col justify-center'>
                            <label htmlFor="password" className='font-bold'>
                                パスワード:
                            </label>
                            <input id='password' type="password" name='password' 
                                className='w-full border border-black rounded-md'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className='w-full h-1/4 flex flex-col justify-center'>
                            <div className='border border-black rounded-md px-2 btn hover:text-white
                                            hover:bg-black py-1 mt-3 w-2/3 text-center w-full'>
                                <button type="submit"  className='w-full'>
                                    {props.role}
                                </button>   
                            </div>
                        </div>
                    </form>
                </div> 
                { props.role === "ログイン" &&
                <div className="h-[20%] w-full flex justify-center"
                     id='navigate-area'
                >
                    <div className='w-full flex flex-col justify-start'>
                        <div className='my-3 flex flex-row '>
                            <p className='border-b border-black btn hover:opacity-55'>パスワードをお忘れの方はこちら</p>
                        </div>
                        <div className='flex flex-row my-3'>
                            <Link to={'/signup'} className='border-b border-red-500 text-red-500 btn hover:opacity-55'>
                                アカウントをお持ちでない方はこちら
                            </Link>
                        </div>
                    </div>
                </div>
                }
            </div>  
        </div>   
    )
}

export default Auth;