# this part of code is used to generate csv files used in 
# multi-line chart and bar chart


# import related libraries
library(tidyr)
library(dplyr)

filtered <- read.csv("filtered.csv",header=T)
filtered$acq_date <- as.Date(filtered$acq_date, format = "%Y-%m-%d")
filtered$state <- as.factor(filtered$state)


# cumulative sum of observations in each state
group_by_state_daily <- filtered %>% group_by(state, acq_date) %>% count()
group_by_state_daily$cumu_sum <- ave(group_by_state_daily$n, group_by_state_daily$state, FUN=cumsum)
group_by_state_daily <- as.data.frame(group_by_state_date)


daily <- spread(group_by_state_daily, state, n)
daily[is.na(daily)] <- 0

group_by_state_daily$n <- NULL
res <- group_by_state_daily %>%
  group_by(acq_date) %>%
  arrange(desc(cumu_sum)) %>%
  mutate(rank = row_number())
res <- res %>%
  arrange(acq_date, desc(cumu_sum))
res$next_val <- with(res, c(cumu_sum[-1L], cumu_sum[1]))
res <- spread(group_by_state_daily, acq_date, cumu_sum)
res[is.na(res)] <- 0
cumsum[is.na(cumsum)] <- 0

write.csv(daily, file="state_obv.csv", row.names = F)
write.csv(cumsum, file="state_obv_cs", row.names = F)
write.csv(res, file="bar.csv",row.names=F)

