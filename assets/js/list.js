function show_hide(elem_name){
	elem = document.getElementById(elem_name)
	sh_elem = document.getElementById(elem_name +'_sh')
	if (elem.style.display == 'block'){
		sh_elem.innerHTML = '[+]'
		elem.style.display = 'none'
	}else{
		sh_elem.innerHTML = '[-]'
		elem.style.display = 'block';
	}

}