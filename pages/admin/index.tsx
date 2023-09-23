import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import React from "react";
import AdminLayout from "@/components/admin-layout";
import { AddIcon } from "@chakra-ui/icons";
import { AlterationTable } from "@/components/alterations-table";
import { useRouter } from "next/router";

export default function Admin() {
  const router = useRouter();

  return (
    <AdminLayout>
      <Card>
        <CardHeader paddingBottom={0}>
          <Flex>
            <Heading size="md">History</Heading>
            <Spacer />
            <Button
              leftIcon={<AddIcon />}
              variant={"brand"}
              onClick={() => router.push("/admin/create")}
            >
              Add
            </Button>
          </Flex>
        </CardHeader>

        <CardBody>
          <AlterationTable />
        </CardBody>
      </Card>
    </AdminLayout>
  );
}
