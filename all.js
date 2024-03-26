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

create_menus()