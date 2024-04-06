common_div = document.createElement("div")


//禁止缩放
function noscale(){
    const meta = document.createElement("meta") 
    meta.name = "viewport" 
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
    document.head.appendChild(meta)
}

function chang_font_size(){

}

// 增加暗黑模式切换 eink/normal
function darkmode() {
    darkstylestr = `
    body,p{
        background-color: #191818;
        color: #fff;
        font-size: x-large;
    }
    p {
        display: flex;
        flex-wrap: wrap;
        padding: 1% 3%;
        line-height: 1.8;
        letter-spacing: 1.3;
        text-align: start;
        justify-content: space-between;
    }
    p a:first-child{
        font-size: xx-large;
        flex: 1 0 calc(100%); 
        /* color: rgb(0, 0, 0); */
        background-color: #645b5b;
        text-decoration: none;
    }
    
    p a {
        box-sizing: border-box;
        padding: 3px;
        border: 3px solid rgb(233, 234, 234); 
        font-size: x-large;
        text-align: center;
        overflow: hidden;
    }
    
    .button-group {
        position: sticky;
        bottom: 0px;         
        display: flex;  
        justify-content: space-around; 
        align-items: center;
        gap: 10px; 
        margin-top: 20px; 
        padding: 8px; 
        background-color: #072202;
        border-radius: 5px;
        font-size: small;
    }
    
    .button-group a {
        text-decoration: none; 
        font-size: larger; 
        padding: 8px 16px; 
        border: 2px solid #070000; 
        border-radius: 5px; 
        transition: all 0.3s ease; 
        background-color: #0f4c04;
        color: #f1f1f1; 
    }
    .switch-container {
        display: inline-block;
        position: relative;
        width: 2.5em;
        height: 1em;
    }
    
    .switch-input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .switch-label {
        display: block;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #fff;
        border-radius: 0.5em;
        transition: background-color 0.3s;
    
        &::before {
            content: "";
            position: absolute;
            top: 2px;
            left: 2px;
            bottom: 2px;
            width: 28px;
            background-color: #000;
            border-radius: 15px;
            transition: transform 0.3s;
        }
    
        &:hover, 
        &:active {
            background-color: #000;
        }
    }
    
    .switch-input:checked + .switch-label {
        background-color: #fff;
    
        &::before {
            transform: translateX(28px);
        }
    }
    
    .switch-inner {
        display: none;
    }
    `
    DarkNode = document.createElement("style")
    DarkNode.textContent = darkstylestr
    document.body.appendChild(DarkNode)
    document.body.classList.add("dark")
}

function sunmode(){
    if(DarkNode){
        DarkNode.remove()
    }
    
    document.body.classList.remove("dark")
}


function create_menus(){
    const wrapper = document.createElement("div")
    wrapper.style=`
        position:fixed;
        right:5px;
        top:5px;
    `
    wrapper.classList.add('switch-container')
    wrapper.innerHTML = `<input type="checkbox" id="mySwitch" class="switch-input" />
    <label for="mySwitch" class="switch-label"><span class="switch-inner"></span>
    </label>`
    document.body.appendChild(wrapper)

    document.getElementById('mySwitch').addEventListener('change', function() {
        if(document.body.classList.contains("dark")){
            sunmode()
        } else {
            darkmode()
        }
    });
}

//调整index.html 目录 返回指向
function check_books_index(){
    return Boolean(window.location.href.replace(window.location.origin,"").match(/\/\d+\/index.html/))
}
function check_book_index(){
    return Boolean(window.location.href.replace(window.location.origin,"").match(/\/\d+\/.+\/index.html/))
}
function backfix(){
        let links = document.querySelector(".button-group").querySelectorAll('a')
        links.forEach(link=>{
            link.href.includes("bbb.html") && (link.href = link.href.replace("bbb.html","index.html"))
        })
}

function add_save_btn(){
    let link = document.querySelector(".button-group").querySelector('a')
    link.before(savebtn())
}

//fetch 书名

function newtextnode (text,styles=""){
  const  d =  common_div.cloneNode()
  d.style = styles;
  d.textContent = text
  return d
}

const booknamestyle = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
`


function get_booknames(){
    const url = "https://ryanlq.github.io/resources/books.json"
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if(check_books_index()){
            let links = document.querySelectorAll("p a")
            links.forEach((link,i)=>{
                i == 0 && (links[i].style.flex = "none")
                const img = link.querySelector("img")
                img.setAttribute("width","230")
                link.style.textDecoration = "none"
                link.style.width = "230px"
                let href = link.href.replace(window.location.origin,"")
                //本地file// test
                
                if(window.location.protocol  == "file:" ){ //test
                    href = link.href.replace("file:///","")
                } 
                
                // href[0] == "/" && (href = href.slice(1))
                const bn =  href.replace(/https?:\/\//,'')
                        .replace(window.location.host,"")
                        .replace("/index.html","")
                        .split("/")
                let n = data[bn[bn.length-1]]
                if(n) {
                    link.style.position = "relative"
                    link.style.display = "inline-block";
                    link.appendChild(newtextnode(n,booknamestyle))
                }
            })
            fix_bookindexpage()
        }

    })
    .catch(error => {
        console.error('Error fetching and parsing data', error);
    });
}
function downloadFile(contents,bookname) {
    var link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contents)); 
    link.setAttribute('download', bookname +'.txt'); // 设置文件名
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}
function save_to_txt(){
    const links = document.querySelectorAll("p a")
    let txtcontents = ''
    var fetchPromises = [] ;
    links.forEach(link=>{
        fetchPromises.push(fetch(link.href))
    })
    
    Promise.all(fetchPromises)
        .then(function(responses) {
            return Promise.all(responses.map(function(response) {
                return response.text();
            }));
        })
        .then(function(dataArray) {
            dataArray.forEach((data,i)=>{
                let chapter = "\n 第" + (i+1) + "章 \n"
                txtcontents = txtcontents + (chapter + data.replaceAll(/<.*>/g,""))
            })
            const paths = window.location.href.replace(window.location.origin+'/','').replace('/index.html','').split('/')
            if(paths.length ==  2){
                fetch("https://ryanlq.github.io/resources/books.json")
                .then(response => response.json())
                .then(result=>{
                        const bookname = result[path[1]]
                        if(bookname)  downloadFile(txtcontents,bookname)
                })
            } else{
                downloadFile(txtcontents,paths.join('-'))
            }
    
        })
        .catch(function(error) {
            console.error('Error fetching data:', error);
        });

}
function savebtn(){
    const linkbtn = document.createElement("a")
    linkbtn.href = "#"
    linkbtn.textContent = "保存为txt"
    linkbtn.addEventListener("click",e=>{
        save_to_txt()
    })
    return linkbtn
}

function fix_bookindexpage(){
    const cn = document.querySelector("a[href='aaa.html']")
    if(cn){ //目录页


        

        cn.innerHTML = "返回"
        cn.href = window.location.origin + "/index.html"
        const p = document.querySelector("p")
        p.style.gap = "1rem"
        p.style.margin = "-0.5%;"
        if(window.innerWidth <900) p.style.justifyContent = "space-evenly"
    }
}

function booksummary(){
        const a1 = document.querySelector("a") 
        if('内容简介' == a1.textContent.replaceAll('\n','')){
            a1.innerHTML = "<iframe src='"+ a1.href +"' style='width:100%;height:100%;'></iframe>"
        }
}

window.onload = function(){
    noscale()
    create_menus()
    if(check_books_index()){ //书架页
        backfix()
        get_booknames()
        fix_bookindexpage()
    }
    if(check_book_index()){ //目录页
        backfix()
        add_save_btn()
    }
    if(window.top != window){ //iframe
        const p = document.querySelector("p");
        p.style = `
            position: fixed;
            background-color: #fff;
            width: auto;
            height: 100%;
            z-index: 99;
            top: 0;
            left: 0;
            font-size: small;
        `
    } 

}

