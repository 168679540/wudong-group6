import React,{useEffect,useState}from'react';import{Table,Button,Popconfirm,message,Tag}from'antd';import{DeleteOutlined}from'@ant-design/icons';import request from'../api/request';
const CommentAdminList:React.FC=()=>{const[data,setData]=useState<any[]>([]);const[loading,setLoading]=useState(false);const[pagination,setPagination]=useState({current:1,pageSize:10,total:0});
const fetch=(page=1,pageSize=10)=>{setLoading(true);request.get('/comment/admin/list',{params:{page,pageSize}}).then((r:any)=>{if(r.success){setData(r.data||[]);setPagination(p=>({...p,current:page,total:r.total||0}));}}).catch(()=>{}).finally(()=>setLoading(false));};
useEffect(()=>{fetch();},[]);
const del=async(id:number)=>{await request.delete('/comment/delete',{params:{id}});message.success('已删除');fetch();};
const columns=[{title:'ID',dataIndex:'id',width:55},{title:'游记ID',dataIndex:'travelNoteId',width:70},{title:'评论',dataIndex:'content',ellipsis:true},{title:'用户',dataIndex:'userId',width:60},{title:'点赞',dataIndex:'likeCount',width:60},{title:'时间',dataIndex:'createdAt',width:155,render:(v:string)=>v?new Date(v).toLocaleString():'-'},{title:'操作',width:80,render:(_:any,r:any)=>(<Popconfirm title="确定删除？" onConfirm={()=>del(r.id)}><Button size="small" danger icon={<DeleteOutlined/>}>删除</Button></Popconfirm>)}];
return(<div><h2>评论管理</h2><Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle" pagination={{...pagination,showTotal:t=>`共 ${t} 条`,onChange:(p,ps)=>fetch(p,ps)}}/></div>);};
export default CommentAdminList;
