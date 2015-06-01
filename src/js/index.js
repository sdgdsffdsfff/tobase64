// 拖拽区域 
var box = document.getElementById('chPic'); 

// 选择事件
box.addEventListener('change',function(){
    // 转换
    getFiles();
})

// 拖拽事件
box.addEventListener('drop',function(e){
    e.preventDefault(); 
    //取消默认浏览器拖拽效果 
    var fileList = e.dataTransfer.files; 
    //检测是否是拖拽文件到页面的操作 
    if(fileList.length == 0){ 
        return false; 
    } 
    //检测文件是不是图片 
    if(fileList[0].type.indexOf('image') === -1){ 
        alert('请选择图片类型'); 
        return false; 
    }else{
        // 转换
        getFiles(fileList);
    }
    
    
},false); 

// 获取图片集
function getFiles(fileList){

    // 图片集数组
    var files;

    // 非拖拉转换
    if(!fileList){
        files = document.getElementById('chPic').files;
    }else if(fileList.length === 0 && document.getElementById('chPic').files.length === 0){
        alert('请重新选择文件');
    }else if(fileList.length > 0){
        files = fileList;
    }

    // 清空已有显示64图片
    var rightBox = document.getElementById('rightBox');
    while(rightBox.hasChildNodes()){
        rightBox.removeChild(rightBox.firstChild);
    }

    // 迭代转换
    for(var i = 0 , maxLength = files.length; i < maxLength; i++ ){
        var imageUrl = getObjectURL(files[i]);
        convertImgToBase64(imageUrl, function(base64Img){ 
            // 图片太大的话转成的64位图字节长度过长，控制台会出现显示不完整导致控制台预览显示不了
            // console.log(base64Img);
            // 页面上显示64位图
            var pic64  = document.createElement('img');
            pic64.src = base64Img;
            var btn  = document.createElement('button');
            btn.innerHTML = '点击复制图片代码';
            btn.setAttribute('data-clipboard-text', base64Img);
            rightBox.appendChild(pic64);
            rightBox.appendChild(btn);
            // 定义一个新的复制对象
            var clip = new ZeroClipboard(btn,{
              moviePath: "../ZeroClipboard/ZeroClipboard.swf"
            }).on('complete', function(client, args) {
                alert("复制成功，复制内容为："+ args.text.substr(0,22));
            });
        }); 
    }
}




// 获取图片url
function getObjectURL(file) {
    var url = null ; 
    // basic
    if (window.createObjectURL!=undefined) { 
        url = window.createObjectURL(file);
    // mozilla(firefox)
    } else if (window.URL!=undefined) { 
        url = window.URL.createObjectURL(file);
    // mozilla(firefox)
    } else if (window.webkitURL!=undefined) {
        url = window.webkitURL.createObjectURL(file);
    }
    return url ;
}

// 通过canvas接口转为64位图
function convertImgToBase64(url, callback, outputFormat){ 
    var canvas = document.createElement('CANVAS'); 
    var ctx = canvas.getContext('2d'); 
    var img = new Image; 
    img.crossOrigin = 'Anonymous'; 
    img.onload = function(){ 
        canvas.height = img.height; 
        canvas.width = img.width; 
        ctx.drawImage(img,0,0); 
        var dataURL = canvas.toDataURL(outputFormat || 'image/png'); 
        callback.call(this, dataURL); 
        canvas = null; 
    }; 
    img.src = url; 
}