import express from 'express';
import cors from 'cors';
import { createClient } from "redis";
import simpleGit from 'simple-git';
import { generateRandomId, getAllfiles } from './utils';
import path from 'path'
import { uploadFiles } from './aws';

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();



const app = express();
app.use(cors());
app.use(express.json());

app.post('/deploy',async (req, res)=> {
    const repoUrl = req.body.repoUrl;
    const id = generateRandomId();
    const localPath = path.join(__dirname, `output/${id}`)

  await  simpleGit().clone(repoUrl, localPath);
  const filePath = getAllfiles(localPath);
  console.log(filePath);

  filePath.forEach(async file=> {
    await uploadFiles( file.slice(__dirname.length + 1), file)
  })
  

  publisher.lPush("build-queue", id as string);
    res.json({
        id: id
    })
});

app.get("/status", async(req, res)=> {
  const id = req.query.id;
  const response =await subscriber.hGet("status", id as string)
  
  res.json({
    status: response
  })
})

app.listen(3001, ()=> {
    console.log('server running')
})