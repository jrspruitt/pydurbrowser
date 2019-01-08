function show_hide(elem_name){
	elem = document.getElementById(elem_name)
	sh_elem = document.getElementById(elem_name +'_sh')
	if (elem.style.display == 'block'){
		sh_elem.className = sh_elem.className.replace('show_hide_c', 'show_hide_e')
		elem.style.display = 'none'
	}else{
		sh_elem.className = sh_elem.className.replace('show_hide_e', 'show_hide_c')
		elem.style.display = 'block'
	}
console.log(sh_elem.className )
}
