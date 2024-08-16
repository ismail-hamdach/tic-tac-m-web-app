import React from "react";
import ConfigurationForm from "./configuration-form";
import Card from "@/components/ui/card-snippet";

const page = () => {
    return <div className="text-2xl font-semibold pt-8">

        <Card title="Configuration">
            <ConfigurationForm />
        </Card>
    </div>;
};

export default page;
