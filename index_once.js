const app = require('./src')

let index = 1
const scheduleJob = async () => { 
  console.log(index)
  index ++
  await app()
}
scheduleJob().then(ret =>{
  console.log("exec done!!")
}).catch(err => {
  console.log("err:",err)
});