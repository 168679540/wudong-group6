import React,{useEffect,useState}from'react';import{Table,Tag}from'antd';import request from'../api/request';
const OperationLogList:React.FC=()=>{const[data,setData]=useState<any[]>([]);const[loading,setLoading]=useState(false);const[pagination,setPagination]=useState({current:1,pageSize:10,total:0});
const fetch=(page=1,pageSize=10)=>{setLoading(true);request.get('/operation-log/list',{params:{page,pageSize}}).then((r:any)=>{if(r.success){setData(r.data||[]);setPagination(p=>({...p,current:page,total:r.total||0}));}}).catch(()=>{}).finally(()=>setLoading(false));};
useEffect(()=>{fetch();},[]);
const columns=[{title:'ID',dataIndex:'id',width:55},{title:'操作人',dataIndex:'operator_name',width:100},{title:'操作',dataIndex:'action',width:100,render:(v:string)=><Tag color="blue">{v}</Tag>},{title:'对象',dataIndex:'target',ellipsis:true},{title:'详情',dataIndex:'detail',ellipsis:true},{title:'IP',dataIndex:'ip',width:120},{title:'时间',dataIndex:'createdAt',width:160,render:(v:string)=>v?new Date(v).toLocaleString():'-'}];
return(<div><h2>操作日志</h2><Table columns={columns} dataSource={data} loading={loading} rowKey="id" size="middle" pagination={{...pagination,showTotal:t=>`共 ${t} 条`,onChange:(p,ps)=>fetch(p,ps)}}/></div>);};
export default OperationLogList;
