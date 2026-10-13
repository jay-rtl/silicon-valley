// Task-scoped deployment helper. Authentication stays in process memory.
import {spawnSync} from 'node:child_process';
const repo='jay-rtl/silicon-valley';
const result=spawnSync('git',['credential','fill'],{input:'protocol=https\nhost=github.com\n\n',encoding:'utf8',env:{...process.env,GIT_TERMINAL_PROMPT:'0',GCM_INTERACTIVE:'Never'}});
const fields=Object.fromEntries((result.stdout||'').trim().split('\n').filter(x=>x.includes('=')).map(x=>{const n=x.indexOf('=');return [x.slice(0,n),x.slice(n+1).trim()];}));
if(result.status!==0||!fields.password){console.error('No existing GitHub credential is available. Authenticate Git for github.com and rerun.');process.exit(2);}
function api(endpoint,method='GET',body){
 const config=`header = "Accept: application/vnd.github+json"\nheader = "Authorization: Bearer ${fields.password}"\nheader = "X-GitHub-Api-Version: 2022-11-28"\n`;
 const args=['--silent','--show-error','--config','-','--request',method,'--write-out','\n%{http_code}',`https://api.github.com${endpoint}`];
 if(body)args.push('--header','Content-Type: application/json','--data',JSON.stringify(body));
 const response=spawnSync('curl.exe',args,{input:config,encoding:'utf8'});
 if(response.status!==0)throw new Error('GitHub API transport failed.');
 const split=response.stdout.lastIndexOf('\n');const code=Number(response.stdout.slice(split+1));let data;try{data=JSON.parse(response.stdout.slice(0,split));}catch{data={};}return {code,data};
}
const mode=process.argv[2]||'status';
if(mode==='enable'){
 let result=api(`/repos/${repo}/pages`);
 if(result.code===404)result=api(`/repos/${repo}/pages`,'POST',{build_type:'workflow'});
 else if(result.code===200&&result.data.build_type!=='workflow')result=api(`/repos/${repo}/pages`,'PUT',{build_type:'workflow'});
 if(![200,201,204].includes(result.code))throw new Error(`Pages setup failed (${result.code}): ${result.data.message||'Unknown error'}`);
 console.log(JSON.stringify({pagesEnabled:true,url:result.data.html_url||'https://jay-rtl.github.io/silicon-valley/',buildType:'workflow'}));
}else{
 const result=api(`/repos/${repo}/actions/workflows/deploy.yml/runs?per_page=1`);
 if(result.code!==200)throw new Error(`Workflow lookup failed (${result.code}): ${result.data.message||'Unknown error'}`);
 const run=result.data.workflow_runs?.[0];console.log(JSON.stringify(run?{id:run.id,status:run.status,conclusion:run.conclusion,url:run.html_url,sha:run.head_sha}:{status:'not_started'}));
 if(run?.conclusion==='failure'){const jobs=api(`/repos/${repo}/actions/runs/${run.id}/jobs`);console.log(JSON.stringify(jobs.data.jobs?.map(j=>({name:j.name,conclusion:j.conclusion,steps:j.steps?.filter(s=>s.conclusion==='failure').map(s=>s.name)}))));}
}
