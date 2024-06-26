import { useState } from "react"
import useConversation from "../zustand/useConversation"
import toast from "react-hot-toast"
const  useSendMessages=()=>
{
    const [loading,setLoading]=useState(false)
    const {messages,setMessages,selectedConversation}=useConversation()
    const sendMessage=async(message)=>{
        setLoading(true)
        try {
            console.log(selectedConversation._id)
            const response=await fetch(`https://mern-chat-app-server-lovat.vercel.app/api/messages/send/${selectedConversation._id}`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({message}),
                credentials:'include'
            })
        const data=await response.json()
        if(data.error){
            throw new Error(data.error)
        }
        setMessages([...messages,data])
        
        } catch (error) {
           toast.error(error.message) 
        }
        finally{
            setLoading(false)
        }
    }
    return {loading,sendMessage}
}


export default useSendMessages
