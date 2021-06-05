# this part of code is used to create csv file
# that used in an interactive map.

# import libraries
library(rgdal)
library(dplyr)

data <- read.csv("filtered.csv")
data <- as.data.frame(data)
cols <- c("latitude", "longitude", "date_time", "state")
data <- data[, cols]
write.csv(data, "spatial_data.csv",row.names = F)



data <- data %>% 
  group_by(state) %>%
  count()
?rename
data <- rename(data, total = n)
write.csv(data, "group_by_state.csv",row.names = F)
