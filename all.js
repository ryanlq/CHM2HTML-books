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
    background-color: #ffffffc9;
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
        if(check_bookindex()){
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

function fix_bookindexpage(){
    const cn = document.querySelector("a[href='aaa.html']")
    if(cn){
        cn.innerHTML = "返回"
        cn.href = window.location.origin + "/index.html"
        const p = document.querySelector("p")
        p.style.gap = "1rem"
        p.style.margin = "-0.5%;"
        if(window.innerWidth <900) p.style.justifyContent = "space-evenly"
    }
}

// window.onload = function(){
    noscale()
    create_menus()
    if(check_bookindex()){
        backfix()
        get_booknames()
        fix_bookindexpage()
    }
// }

