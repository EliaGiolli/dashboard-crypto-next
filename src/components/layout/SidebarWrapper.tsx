'use client'

//Components
import Sidebar from "../shared/Sidebar";
import { DrawerDashboardMenu } from "../shared/DrawerDashboardMenu";
//Internal imports
import { useMediaQuery } from 'usehooks-ts';
import { useFetchCrypto } from "../../custom hooks/useFetchCrypto";

function SidebarWrapper() {
    //It controls the window's width in a more reactive way
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const { data, error, isLoading } = useFetchCrypto(10);
    
  return (
    <>
     {isDesktop ? (
        <Sidebar 
          data={data} 
          error={error} 
          isLoading={isLoading}
        />
      ) : (
        <DrawerDashboardMenu 
          data={data} 
          error={error} 
          isLoading={isLoading}
        />
      )}
    </>
  )
}

export default SidebarWrapper