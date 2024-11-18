import './App.css';
import {useState} from "react";
import {useCookies} from "react-cookie";

var ws = new WebSocket("wss://andyxie.cn:8181");

function send(username, msg) {
    msg = msg.replaceAll("\\n", "\n")
    ws.send(JSON.stringify({username: username, msg: msg}));

}

function App() {
    ws.onmessage = (e) => {
        setMsgBuffer(msgBuffer + e.data + "\n")
        document.getElementById("output").scrollTop = document.getElementById("output").scrollHeight + 40;
    }

    const [msgBuffer, setMsgBuffer] = useState(
        "Welcome to World IO v1.0.0!\n" +
        "欢迎来到 世界IO 1.0.0\n" +
        "使用\\n以换行 | Use \\n to return. " +
        "不消考虑任何规则：发就完事了 ｜ No need to consider boundaries: just SEND IT!!!!!"+
        "历史记录：|History: \n");
    const [msg, setMsg] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(['username']);
    const [username, setUsername] = useState(cookies["username"] === undefined ? "Anonymous":  cookies["username"]);

    return (
        <div className="App" style={{width: "100%", display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div style={{flex: 2, width: '99.8%'}}>
                <textarea id={"output"} style={{width: "100%", height: "100%", resize: "none",}}
                          disabled={true} value={msgBuffer}></textarea>
            </div>
            <div style={{display: "flex", flexDirection: "row", height: "30px", width: "100%"}}>
                <input placeholder={"Stuff"} style={{padding: "0", resize: "none", flexGrow: 1}} value={msg}
                       onChange={(s) => {
                           setMsg(s.target.value)
                       }} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        send(username, msg);
                        setMsg("")
                    }
                }}></input>
                <input placeholder={"Username"} value={username} onChange={(e) => {
                    setUsername(e.target.value)
                }}
                       onBlur={(e) => {
                           setCookie("username", e.target.value, {path: "/worldio_client"});
                       }}
                ></input>
                <button onClick={() => {
                    send(username, msg)
                    setMsg("")
                }}>Send
                </button>
            </div>
        </div>
    );
}

export default App;
