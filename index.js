const fs = require('fs');
const http=require('http');
const url=require('url');
const slugify =require('slugify')

const replaceTemplate=require('./modules/replaceTemplate')
const { getSystemErrorMap } = require('util');
// const { Console } = require('console');
// const fs=require('fs')

// // //Blocking Code(Synchronous)
// // const text=fs.readFileSync('./txt/input.txt','utf-8')
// // console.log(text)

// // const textOut='This is Just an example text to be added in Input.txt file'

// // fs.writeFileSync('./txt/output.txt',textOut)

// // fs.readFile('./txt/input.txt','utf-8',(err,data)=>{
// //     console.log("Completed Reading File",data)
// // })
// // console.log('Reading File')

// //NON_Blocking(Asynchronous way)
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     if(err) return console.log('ERROR');
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//     console.log(data2);
//     fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//         console.log(data3);
//         fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8',(err)=>{
//             console.log("Your File has been Written")
//         })
//         });
//     });
// });
// console.log(' Will Read File');

/////////////////////////////////////
//SERVER


const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj=JSON.parse(data);

console.log(slugify('Fresh Avacados',{
    lower:'true'}));

const server=http.createServer((req,res)=>{
    // console.log(req.url);
    // console.log(url.parse(req.url,true));
    const {query,pathname}=url.parse(req.url,true);
    console.log(query);

    //OVERVIEW
    if(pathname==='/overview' || pathname==='/'  || pathname===''){
        res.writeHead(200,{
            'Content-type':'text/html'
        });

        const cardsHtml=dataObj.map((el)=>replaceTemplate(tempCard,el)).join('');
        console.log(cardsHtml);
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);
        res.end(output);
    }

    //Product Page
    else if( pathname==='/product'){
        res.writeHead(200,{
            'Content-type':'text/html'
        });
        const product=dataObj[query.id];
        const output=replaceTemplate(tempProduct,product);
        res.end(output);
    }

    //API
    else if(pathname==='/api'){
            res.writeHead(200,{
                'Content-type':'application/json'
            });
            res.end(data);
            console.log(dataObj)
    }
    else{
        res.writeHead(404,{
            'Content-type':'text/html'
        })
        res.end('<h1>Page Not Found</h1>');
    }

                
})
server.listen(8000,"127.0.0.1",()=>{
    console.log('Listening at Port',server.address())  
})
