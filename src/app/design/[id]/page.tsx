import dynamic from "next/dynamic";

const DesignPage = dynamic(() => import("./DesignPage"), { ssr: false });

export default DesignPage;
