# import related libraries
library(dplyr)
library(stringr)
library(sp)
library(rgdal)
library(parallel)
library(doParallel)
library(rgeos)
# set working directory
# setwd("your working directory")
# read files

# load data
# data source: https://www.kaggle.com/carlosparadis/fires-from-space-australia-and-new-zeland
fireData1 <- read.csv("fire_archive_M6_96619.csv", header = T)
fireData2 <- read.csv("fire_nrt_M6_96619.csv", header = T)

# merge two csv files
# since the type is meaningless in the visualization process
# I simply remove this column
fireData1$type <- NULL
fireData <- rbind(fireData1, fireData2)
# modify data format
# create a new column that concatenate both date and time
fireData$acq_date <- as.Date(fireData$acq_date, format = "%Y-%m-%d")
fireData$acq_time <- as.character(fireData$acq_time)
fireData$acq_time <-
  str_pad(fireData$acq_time, pad = "0", width = 4)
fireData$acq_time <-
  gsub("^([0-9]{2})([0-9]+)$", "\\1:\\2", fireData$acq_time)
fireData$date_time <- paste(fireData$acq_date, fireData$acq_time)
# use POSIXct to deal with date time value
fireData$date_time <-
  as.POSIXct(fireData$date_time, format = "%Y-%m-%d %H:%M", tz = "GMT")
# change the time zone to Melbourne
attr(fireData$date_time, "tzone") <- "Australia/Melbourne"
# change other categorical value
fireData$satellite <- as.factor(fireData$satellite)
fireData$daynight <- as.factor(fireData$daynight)

filtered <- fireData %>%
  filter(confidence >= 80)



# reverse geocoding
# this reverse geocoding method is retrieved from: https://rpubs.com/FelipeMonroy/619723
# read the state map
state_map <- readOGR(dsn="state_map_10m", layer="ne_10m_admin_1_states_provinces")
#function used to reverse geocoding based on coordinates
reverse <- function(lat,lon){
  # create a spatial point using lat and lon
  point <- SpatialPoints(matrix(c(lon, lat),ncol=2,nrow=1))
  # create a projection of the point on state map
  proj4string(point) <- proj4string(state_map)
  state <- as.character(over(point,state_map)$name)
  return (state)
}
# using parallel processing to make the process faster
filtered$state <- "place_holder"
registerDoParallel(makeCluster(11))
map <- foreach(i=1:nrow(filtered), .packages=c("sp", "rgdal"), .combine = rbind) %dopar% {
  reverse(filtered[i, "latitude"], filtered[i, "longitude"])
}
filtered$state <- map

# because the parallel processing takes relatively
# long time it is more efficiency to write the  
# normalized data to a new csv file
write.csv(filtered, file = "filtered.csv")
filtered$state <- as.factor(filtered$state)

# group by state
group_by_state <- filtered %>% group_by(state) %>% count()

# cumulative sum of observations in each state
group_by_state_date <- filtered %>% group_by(state, acq_date) %>% count()
group_by_state_date$cumu_sum <- ave(group_by_state_date$n, group_by_state_date$state, FUN=cumsum)
write.csv(group_by_state_date, file="state_obv.csv")