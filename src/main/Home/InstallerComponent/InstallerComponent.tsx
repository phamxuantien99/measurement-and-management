import "react-datepicker/dist/react-datepicker.css";
import HomeLeftComponentInstaller from "./HomeLeftCompoentInstaller/HomeLeftComponentInstaller";
import HomeRightComponentInstaller from "./HomeRightComponentInstaller/HomeRightComponentInstaller";

const InstallerComponent = () => {
  return (
    <div className="bg-[#0d75be] min-h-screen">
      <div className="grid xl:grid-cols-4">
        <div className="xl:col-span-1 p-5 flex items-center justify-center glass min-h-screen">
          <HomeLeftComponentInstaller />
        </div>
        <div className="xl:col-span-3 max-h-[100vh] overflow-y-auto p-5">
          <div>
            <HomeRightComponentInstaller />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallerComponent;
