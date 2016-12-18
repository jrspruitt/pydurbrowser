	Mechcalc.prototype.units = {
	solid_angle: {"convert_to": "sr", "(°)²": {"conv": "0.0030462"}, "sr": {"conv": "1"}},
	force: {"ozf": {"conv": "0.2780138203095378125"}, "STf": {"conv": "8896.443230521"}, "mN": {"conv": "0.001"}, "mgf": {"conv": "0.00000980665"}, "nN": {"conv": "0.000000001"}, "convert_to": "N", "MN": {"conv": "1000000"}, "kN": {"conv": "1000"}, "N": {"conv": "1"}, "grf": {"conv": "0.0006354602307515"}, "gf": {"conv": "0.00980665"}, "LTf": {"conv": "9964.01641818352"}, "GN": {"conv": "1000000000"}, "lbf": {"conv": "4.4482216152605"}, "tf": {"conv": "9806.65"}, "μN": {"conv": "0.000001"}, "kgf": {"conv": "9.80665"}},
	energy: {"nJ": {"conv": "0.000000001"}, "pJ": {"conv": "0.000000000001"}, "MW·h": {"conv": "3600000000"}, "in·lbf": {"conv": "0.1129848290276167"}, "cJ": {"conv": "0.01"}, "Mcal": {"conv": "4184000"}, "kW·h": {"conv": "3600000"}, "kJ": {"conv": "1000"}, "W·h": {"conv": "3600"}, "ft·lbf": {"conv": "1.3558179483314004"}, "convert_to": "J", "J": {"conv": "1"}, "mJ": {"conv": "0.001"}, "Cal": {"conv": "4.184"}, "mcal": {"conv": "0.004184"}, "GJ": {"conv": "1000000000"}, "Btu": {"conv": "1055.05585262"}, "hp·h": {"conv": "2684519.537696172792"}, "dJ": {"conv": "0.1"}, "daJ": {"conv": "10"}, "MJ": {"conv": "1000000"}, "hJ": {"conv": "100"}, "kcal": {"conv": "4184"}, "μW·h": {"conv": "0.0036"}, "mW·h": {"conv": "3.6"}, "μJ": {"conv": "0.000001"}, "in·ozf": {"conv": "0.00706155181422604375"}},
	torque: {"lbf·ft": {"conv": "1.3558179483314004"}, "convert_to": "N·m", "lbf·in": {"conv": "0.112984829"}, "ozf·in": {"conv": "0.007061552"}, "N·m": {"conv": "1"}, "kgf-m": {"conv": "9.80665"}},
	resistance: {"Ω": {"conv": "1"}, "convert_to": "Ω", "kΩ": {"conv": "1000"}, "mΩ": {"conv": "0.001"}, "MΩ": {"conv": "1000000"}}, 
	frequency: {"Hz": {"conv": "1"}, "r/h": {"conv": "0.000277778"}, "kHz": {"conv": "1000"}, "convert_to": "Hz", "GHz": {"conv": "1000000000"}, "Mhz": {"conv": "1000000"}, "r/min": {"conv": "0.016666667"}, "r/s": {"conv": "1"}},
	voltage: {"convert_to": "V", "mV": {"conv": "0.001"}, "V": {"conv": "1"}},
	speed: {"ft/s": {"conv": "0.3048"}, "in/s": {"conv": "0.0254"}, "m/s": {"conv": "1"}, "convert_to": "m/s", "mpm": {"conv": "26.8224"}, "km/h": {"conv": "0.277777778"}, "mph": {"conv": "0.44704"}, "in/min": {"conv": "0.000423333"}, "mps": {"conv": "1609.344"}, "knot": {"conv": "0.514444"}, "ft/h": {"conv": "0.00008466667"}, "in/h": {"conv": "0.00000705556"}, "ft/min": {"conv": "0.00508"}},
	acceleration: {"ips²": {"conv": "0.0254"}, "convert_to": "m/s²", "m/s²": {"conv": "1"}},
	area: {"ac": {"conv": "4046.873"}, "sq mi": {"conv": "2589988.110336"}, "sq in": {"conv": "0.00064516"}, "convert_to": "m²", "sq yd": {"conv": "0.83612736"}, "hm²": {"conv": "10000"}, "mm²": {"conv": "0.000001"}, "dam²": {"conv": "100"}, "dm²": {"conv": "0.01"}, "km²": {"conv": "1000000"}, "m²": {"conv": "1"}, "sq ft": {"conv": "0.09290304"}, "cm²": {"conv": "0.0001"}},
	current: {"A": {"conv": "1"}, "convert_to": "A", "mA": {"conv": "0.001"}, "nA": {"conv": "0.000000001"}},
	capacitance: {"μF": {"conv": "0.000001"}, "convert_to": "F", "pF": {"conv": "0.000000000001"}, "nF": {"conv": "0.000000001"}, "F": {"conv": "1"}},
	angular_velocity: {"r/h": {"conv": "0.001745329"}, "Hz": {"conv": "0.636619772"}, "rad/d": {"conv": "0.000694444"}, "convert_to": "rad/s", "rad/m": {"conv": "0.0166666666667"}, "°/s": {"conv": "0.017453292"}, "rad/s": {"conv": "1"}, "°/m": {"conv": "0.000290888"}, "°/h": {"conv": "0.000004848"}, "rad/h": {"conv": "0.000277778"}, "r/d": {"conv": "0.000072722"}, "°/d": {"conv": "0.00001212"}, "r/s": {"conv": "6.283185311"}, "r/min": {"conv": "0.104719755"}},
	plane_angle: {"convert_to": "rad", "rad": {"conv": "1"}, "°": {"conv": "0.17453293"}},
	power: {"metric hp": {"conv": "735.49875"}, "ft·lbf/min": {"conv": "0.022596966"}, "convert_to": "W", "hp": {"conv": "745.699881448"}, "ft·lbf/h": {"conv": "0.000376616"}, "elec hp": {"conv": "746"}, "ft·lbf/s": {"conv": "1.355817948"}, "W": {"conv": "1"}, "btu/h": {"conv": "3.412141633"}},
	volume: {"cu ft": {"conv": "0.028316846592"}, "bbl": {"conv": "0.119240471196"}, "fl oz": {"conv": "0.0000295735295625"}, "qt": {"conv": "0.000946352946"}, "pt": {"conv": "0.000473176473"}, "convert_to": "m³", "L": {"conv": "0.001"}, "cu yd": {"conv": "0.764554857984"}, "hm³": {"conv": "1000000"}, "gal": {"conv": "0.003785411784"}, "cu in": {"conv": "0.000016387064"}, "mm³": {"conv": "0.000000001"}, "m³": {"conv": "1"}, "dam³": {"conv": "1000"}, "km³": {"conv": "1000000000"}, "kL": {"conv": "1"}, "cm³": {"conv": "0.000001"}, "dm³": {"conv": "0.001"}, "mL": {"conv": "0.000001"}, "cu mi": {"conv": "4168181825.440579584"}},
	pressure: {"mmHg": {"conv": "133.322387415"}, "atm": {"conv": "101325"}, "bar": {"conv": "100000"}, "Ba": {"conv": "0.1"}, "inHg": {"conv": "3386.388640341"}, "mPa": {"conv": "0.001"}, "convert_to": "Pa", "kBa": {"conv": "100"}, "GPa": {"conv": "1000000000"}, "MPa": {"conv": "1000000"}, "kPa": {"conv": "1000"}, "psi": {"conv": "6894.757293168"}, "mbar": {"conv": "100"}, "dbar": {"conv": "10000"}, "hPa": {"conv": "100"}, "Pa": {"conv": "1"}},
	inductance: {"nH": {"conv": "0.000000001"}, "convert_to": "H", "mH": {"conv": "0.001"}, "H": {"conv": "1"}, "pH": {"conv": "0.000000000001"}, "μH": {"conv": "0.000001"}},
	hashrate: {"GH/s": {"conv": "1000000000"}, "convert_to": "H/s", "kH/s": {"conv": "1000"}, "H/s": {"conv": "1"}, "MH/s": {"conv": "1000000"}},
	density: {"lb/ft³": {"conv": "0.06242796059157827"}, "oz/ft³": {"conv": "0.9988473690911163"}, "g/mL": {"conv": "0.001"}, "convert_to": "kg/m³", "oz/in³": {"conv": "0.00005780366721308782"}, "lb/in³": {"conv": "0.0000361272920003488"}, "kg/m³": {"conv": "1"}, "kg/L": {"conv": "0.001"}},
	flow: {"convert_to": "m³/s", "m³/s": {"conv": "1"}, "ft³/s": {"conv": "0.028316846592"}, "in³/min": {"conv": "0.00000027311773"}, "in³/s": {"conv": "0.0000016387064"}, "ft³/min": {"conv": "0.0004719474432"}},
	length: {"dm": {"conv": "0.1"}, "ft": {"conv": "0.3048"}, "nm": {"conv": "0.000000001"}, "cm": {"conv": "0.01"}, "mm": {"conv": "0.001"}, "convert_to": "m", "in": {"conv": "0.0254"}, "m": {"conv": "1"}, "yd": {"conv": "0.9144"}, "km": {"conv": "1000"}, "Mm": {"conv": "1000000"}, "dam": {"conv": "10"}, "hm": {"conv": "100"}, "mi": {"conv": "1609.344"}, "Gm": {"conv": "1000000000"}, "μm": {"conv": "0.000001"}, "nmi": {"conv": "18521"}},
	mass: {"tonne": {"conv": "1000"}, "mg": {"conv": "0.000001"}, "kg": {"conv": "1"}, "g": {"conv": "0.001"}, "convert_to": "kg", "carat": {"conv": "0.0002"}, "μg": {"conv": "0.000000001"}, "ozt": {"conv": "0.0311034768"}, "ton": {"conv": "907.18474"}, "oz": {"conv": "0.028"}, "lb": {"conv": "0.45359237"}},
	stiffness: {"N/m": {"conv": "1"}, "gf/mm": {"conv": "9.806650124809"}, "convert_to": "N/mm", "gf/cm": {"conv": "98.06650124809"}, "lbf/ft": {"conv": "14.593903082"}, "kgf/m": {"conv": "9.806650125"}, "kgf/mm": {"conv": "9806.650124809"}, "lbf/in": {"conv": "175.126836986433"}, "ozf/in": {"conv": "10.945427312"}, "N/mm": {"conv": "1000"}}, time: {"ns": {"conv": "0.000000001"}, "μs": {"conv": "0.000001"}, "min": {"conv": "60"}, "hr": {"conv": "3600"}, "convert_to": "s", "mo": {"conv": "2592000"}, "wk": {"conv": "604800"}, "sec": {"conv": "1"}, "ms": {"conv": "0.001"}, "yr": {"conv": "31536000"}, "d": {"conv": "86400"}},
	temperature: {"convert_to": "K",
	"K" : {conv: 
    function(value, to){
	    switch(to){
		    case 'K':
			    return value;
		    case '°F':
			    return ((value-273.15)*1.8)+32;
		    case '°C':
			    return value-273.15;
    }}},
    "°C" : {conv: 
    function(value, to){
	    switch(to){
		    case '°C':
			    return value;
		    case '°F':
			    return (value*1.8)+32;
		    case 'K':
			    return value+273.15;
    }}},

    "°F" : {conv:  
    function(value, to){
	    switch(to){
		    case '°F':
			    return value;
		    case '°C':
			    return (value-32)*0.555555556;
		    case 'K':
			    return ((value-32)*0.555555556)+273.15;
    }}}}

    };
