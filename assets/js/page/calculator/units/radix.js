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

function radix(){
mc.units["radix"]["bin"] = {unit:"bin", conv: 
function(inp){
	switch(inp.u.convert_to){
		case "bin":
			return inp.value;
		case "oct":
			return parseInt(inp.value, 2).toString(8);
		case "dec":
			return parseInt(inp.value, 2);
		case "hex":
			return parseInt(inp.value, 2).toString(16);
}}};
mc.units["radix"]["oct"] = {unit:"oct", conv: 
function(inp){
	switch(inp.u.convert_to){
		case "oct":
			return inp.value;
		case "bin":
			return parseInt(inp.value, 8).toString(2);
		case "dec":
			return parseInt(inp.value, 8);
		case "hex":
			return parseInt(inp.value, 8).toString(16);
}}};

mc.units["radix"]["dec"] = {unit:"dec", conv:  
function(inp){
	switch(inp.u.convert_to){
		case "dec":
			return inp.value;
		case "bin":
			return parseInt(inp.value, 10).toString(2);
		case "oct":
			return parseInt(inp.value, 10).toString(8);
		case "hex":
			return parseInt(inp.value, 10).toString(16);
}}};

mc.units["radix"]["hex"] = {unit:"hex", conv:  
function(inp){
	switch(inp.u.convert_to){
		case "hex":
			return inp.value;
		case "bin":
			return parseInt(inp.value, 16).toString(2);
		case "oct":
			return parseInt(inp.value, 16).toString(8);
		case "dec":
			return parseInt(inp.value, 16);
}}};
}
