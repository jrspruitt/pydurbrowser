/**
 * @license Mechcalc Copyright 2013 Jason Pruitt	
 * This file is part of Mechcalc.
 *
 * Mechcalc is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Mechcalc is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Mechcalc.  If not, see <http://www.gnu.org/licenses/>.
 */

// temperature
// with no easy conversion number functions are required for conv:
// app_calc.js convert_input() check for a function, calls with id
// if available

//if(!mc.units){ mc.units = new Object();}
//mc.units['temperature'] = new Object();

// default unit for internal conversion if none specified
//mc.units['temperature'].convert_to = 'K';
function temperature(){
mc.units['temperature']['K'] = {label:'', idx:0, conv: 
function(value, to){
	switch(to){
		case 'K':
			return value;
		case '°F':
			return ((value-273.15)*1.8)+32;
		case '°C':
			return value-273.15;
}}};
mc.units['temperature']['°C'] = {label:'', idx:1, conv: 
function(value, to){
	switch(to){
		case '°C':
			return value;
		case '°F':
			return (value*1.8)+32;
		case 'K':
			return value+273.15;
}}};

mc.units['temperature']['°F'] = {label:'', idx:2, conv:  
function(value, to){
	switch(to){
		case '°F':
			return value;
		case '°C':
			return (value-32)*0.555555556;
		case 'K':
			return ((value-32)*0.555555556)+273.15;
}}};
}