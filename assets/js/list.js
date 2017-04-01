function show_hide(elem_name){
	elem = document.getElementById(elem_name)
	sh_elem = document.getElementById(elem_name +'_sh')
	if (elem.style.display == 'block'){
		sh_elem.className = 'show_hide_e'
		elem.style.display = 'none'
	}else{
		sh_elem.className = 'show_hide_c'
		elem.style.display = 'block';
	}

}
