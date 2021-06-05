# this part of code is used for convert shapefile to geojson format. It is retrieved 
# from : https://blog.exploratory.io/creating-geojson-out-of-shapefile-in-r-40bc0005857d
# setwd("set your work directory here")

# import related libraries
library(rgdal)
library(spdplyr)
library(geojsonio)
library(rmapshaper)

# change these two variable
your_dsn = ""
file_dir_and_name = ""

# run following code to start convert
# it might take a while, depends on the
# size of shape file
aus_map_obj <- readOGR(dsn = your_dsn,
                       layer = "STE_2016_AUST",
                       verbose=F)
aus_map_json <- geojson_json(aus_map_obj)
aus_map_json_simp <- ms_simplify(aus_map_json)
geojson_write(aus_map_json_simp, file=file_dir_and_name)
