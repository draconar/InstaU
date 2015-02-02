#!/bin/sh
if [ -n "${1}" ]; then 	# -n tests to see if the argument is non empty
		if [ ${1} -eq 0  ]; then		
		curl 'http://access.alchemyapi.com/calls/url/URLGetCategory?apikey=a7f90afdbd519601c28afd5e3e18294af3b3867b&outputMode=json&url='${2}
		elif [ ${1} -eq 1  ]; then 
		curl 'http://access.alchemyapi.com/calls/url/URLGetRankedNamedEntities?apikey=a7f90afdbd519601c28afd5e3e18294af3b3867b&outputMode=json&url='${2}
		elif [ ${1} -eq 2  ]; then
		curl 'http://access.alchemyapi.com/calls/url/URLGetRankedConcepts?apikey=a7f90afdbd519601c28afd5e3e18294af3b3867b&outputMode=json&url='${2}
		elif [ ${1} -eq 3  ]; then
		curl 'http://access.alchemyapi.com/calls/url/URLGetRankedKeywords?apikey=a7f90afdbd519601c28afd5e3e18294af3b3867b&outputMode=json&url='${2}
		elif [ ${1} -eq 4  ]; then 
		curl 'http://access.alchemyapi.com/calls/url/URLGetText?apikey=a7f90afdbd519601c28afd5e3e18294af3b3867b&outputMode=json&url='${2}
		else
		echo 'undefined'
		fi
else
echo 'undefined'
fi