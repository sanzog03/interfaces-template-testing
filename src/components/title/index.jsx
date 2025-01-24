import React from "react";
import styled from "styled-components";

import { Paper, Typography, Divider } from "@mui/material";
import "./index.css";
import { Search } from "../../components/search";
import { FilterByDate } from '../../components/filter';
import { VizItemAnimation } from '../../components/plumeAnimation';

 const HorizontalLayout = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 12px;
`;
 const TitleContainer = ({ children }) => {
    return (
        <Paper className="title-container">
            <Typography
                variant="h6"
                component="div"
                className="title-head"
                fontWeight="bold"
                sx={{margin: "0 0.9rem"}}
            >
                GOES Methane Plume Viewer
            </Typography>
            <Typography
                variant="body2"
                component="div"
                className="title-note"
                sx={{margin: "0 0.9rem", color: "text.secondary"}}
            >
                The Geostationary Operational Environmental Satellites collect images of the surface every 5 minutes. Only very large emission events can be detected, but plume expansion is easy to see over time. More plumes will be added soon.
            </Typography>
            <Divider
                sx={{
                    borderColor: "var(--main-blue)",
                    borderWidth: "1px",
                    margin: "0.3rem 1.4rem",
                }}
            />
            <div className="title-content">
                { children }
            </div>
        </Paper>
    )
 }

const Title = ({vizItemIds,handleSelectedVizItemSearch,regions,selectedVizItems,setFilteredRegions,setFilteredSelectedVizItems,vizItemsForAnimation }) => {
    
    return(
     <TitleContainer>
            <HorizontalLayout>
              <Search
                ids={vizItemIds}
                handleSelectedVizItemSearch={handleSelectedVizItemSearch}
              ></Search>
            </HorizontalLayout>
            <HorizontalLayout>
              <FilterByDate
                regions={regions}
                vizItems={selectedVizItems}
                setFilteredRegions={setFilteredRegions}
                setFilteredSelectedVizItems={setFilteredSelectedVizItems}
              />
            </HorizontalLayout>
            <HorizontalLayout>
              <VizItemAnimation vizItems={vizItemsForAnimation} />
            </HorizontalLayout>
    </TitleContainer>)
}
export default Title
