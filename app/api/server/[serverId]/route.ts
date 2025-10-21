import { NextResponse } from "next/server";
import { db } from "@/config/db";
import {channels , members , users} from "@/config/schema"

import {eq} from "drizzle-orm"




export async function GET(
    req:Request,
    {params} : {params: {serverId:string}}
){
    const {searchParams} = new URL(req.url)

    const type = searchParams.get("type")

    try{
        if(!params.serverId){
            return new NextResponse ("server ID is missing ", {status:400})
        }

        if(type === "channels"){
            const channelList = await db.query.channels.findMany({
                where: eq(channels.serverId, params.serverId)
            })
            return NextResponse.json(channelList)
        }

        if(type === "members"){
            const memberData= await db
            .select({
                id: users.id,
                name: users.username,
                avatar: users.imageUrl,
                // status: "Online",
            })
            .from(members)
            .leftJoin(users,  eq(members.userId ,users.id))
            .where(eq(members.serverId, params.serverId))
            const memberList = memberData.map(member => ({
                ...member,
                status: "Online" 
            }));
        return NextResponse.json(memberList)    
        }

        return new NextResponse ("Invalid request type", {status:400})

    }catch(error){
        console.error("[ServerIdGet]", error)
        return new NextResponse ("Internal Server Error", {status: 500})
    }

}