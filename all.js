config = {
    hosts:window.location.host
}

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
    }
    p a:first-child{
        font-size: xx-large;
        flex: 1 0 calc(100%); 
        color: rgb(0, 0, 0);
        background-color: #645b5b;
        text-decoration: none;
    }
    
    p a {
        flex: 1 0 calc(50% - 10px); 
        box-sizing: border-box;
        padding: 10px;
        border: 1px solid rgb(66, 74, 70); 
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
        padding: 10px; 
        background-color: #072202;
        border-radius: 5px; 
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
        &:hover {
            background-color: #4c3904; 
           
            font-weight: bolder;
            box-shadow:0px 0px 0px 4px #f2d056 inset;       
            }
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
function check_bookindex(){
    return window.location.href.includes("index.html")
}

function backfix(){
    if(check_bookindex()){
        let links = document.querySelector(".button-group").querySelectorAll('a')
        links.forEach(link=>{
            link.href.includes("bbb.html") && (link.href = link.href.replace("bbb.html","index.html"))
        })

    }
}

//fetch 书名

function newtextnode (text){
  const  d =  common_div.cloneNode()
  d.textContent = text
  return d
}
function get_booknames(){
    const url = "https://cdn.jsdelivr.net/gh/ryanlq/CHM2HTML-books@main/books.json"
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if(check_bookindex()){
            let links = document.querySelectorAll("p a")
            links.forEach(link=>{
                let href = link.href.replace(config.host,"")
                //本地file// test
                
                if(!config.host){ //test
                    console.log(config.host);
                    href = link.href.replace("file:///E:/txt%E4%B9%A6%E7%B1%8D/chm/test","")
                } 
                
                console.log(href);
                href[0] == "/" && (href = href.slice(1))
                let n = data[href.split("/")[0]]
                console.log(href, n);
                if(n) {
                    link.appendChild(newtextnode(n))
                    
                }
            })
        }

    })
    .catch(error => {
        console.error('Error fetching and parsing data', error);
    });
}


window.onload = function(){
    noscale()
    create_menus()
    if(check_bookindex()){
        backfix()
        get_booknames()
    }
}

