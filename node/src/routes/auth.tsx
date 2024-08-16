import React from "react";
import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Stack, useDisclosure } from "@chakra-ui/react";

import { useAuth } from "@/auth";
import styles from "./auth.module.css";
import authBeforeLoad from "@/authBeforeLoad";
import { sleep } from "@/utils";

// 未認証であれば、ログインページへリダイレクト
export const Route = createFileRoute("/auth")({
  beforeLoad: authBeforeLoad,
  component: AuthLayout,
});

function AuthLayout() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = Route.useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    if (window.confirm("ログアウトしますか？")) {
      await logout();
      await sleep(250);
      navigate({ to: "/login" });
    }
  };

  return (
    <>
      <Box bg="teal.500" px={4} mb={2}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <IconButton
            size="md"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label="Toggle navigation"
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            color="black"
          />
          <Flex alignItems="center">
            <Link
              to="/auth/top"
              fontSize="lg"
              fontWeight="bold"
              color="white"
              mr={4}
              _hover={{ textDecoration: "none", color: "gray.200" }}
            >
              MySite
            </Link>
            <Stack
              direction="row"
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              <Link
                to="/auth/top"
                className="linkButton"
                color="white"
                _hover={{ textDecoration: "none", color: "gray.200" }}
              >
                Top
              </Link>
              <Link
                to="/auth/recipes"
                className="linkButton"
                color="white"
                _hover={{ textDecoration: "none", color: "gray.200" }}
              >
                Recipes
              </Link>
              <Link
                to="/auth/recipe/new"
                className="linkButton"
                color="white"
                _hover={{ textDecoration: "none", color: "gray.200" }}
              >
                Post Recipe
              </Link>
              <Link
                onClick={handleLogout}
                className="linkButton"
                color="white"
                _hover={{ textDecoration: "none", color: "gray.200" }}
              >
                Logout
              </Link>
            </Stack>
          </Flex>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as="nav" spacing={4}>
              <Link
                to="/auth/top"
                onClick={() => {
                  onClose();
                }}
                className="linkButton"
                color="white"
                _hover={{ textDecoration: "none", color: "gray.200" }}
              >
                Top
              </Link>
              <Link
                to="/auth/recipes"
                onClick={() => {
                  onClose();
                }}
                className="linkButton"
                color="white"
                _hover={{ textDecoration: "none", color: "gray.200" }}
              >
                Recipes
              </Link>
              <Link
                to="/auth/recipe/new"
                onClick={() => {
                  onClose();
                }}
                className="linkButton"
                color="white"
                _hover={{ textDecoration: "none", color: "gray.200" }}
              >
                Post Recipe
              </Link>
              <Link
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                className="linkButton"
                color="white"
                _hover={{ textDecoration: "none", color: "gray.200" }}
              >
                Logout
              </Link>
            </Stack>
          </Box>
        )}
      </Box>
      <div className="col-span-3 py-2 px-4">
        <Outlet />
      </div>
    </>
  );
}
