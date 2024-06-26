import { useEffect,useState } from "react"
import toast from "react-hot-toast"

const useGetConversation=()=>{
    const [loading,setLoading]=useState(false)
    const [conversation,setConversation]=useState([])
  
        useEffect(()=>{
            const getconversation=async()=>{
                setLoading(true)
                try {
                    const res=await fetch("https://mern-chat-app-server-lovat.vercel.app/api/users",
                                          {
                                              method:'GET',
                                              credentials:'include'
                                          }
                                         )
                    const data=await res.json()
                    if(data.error){
                        throw new Error(data.error)
                    }
                   setConversation(data)
                    
                } catch (error) {
                  toast.error(error.message)  
                }
                finally{
                    setLoading(false)
                }
              
            }
            getconversation()
        },[])
return {loading,conversation}
}
export default useGetConversation
