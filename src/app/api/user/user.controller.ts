import { Prisma } from "@prisma/client";
import prisma from "../../../lib/prisma";

export async function createUser(data: Prisma.UserCreateArgs) {
  return prisma.user.create(data);
}

export async function getUser(data: Prisma.UserFindUniqueArgs) {
  return prisma.user.findUnique(data);
}

export async function getUsers(data: Prisma.UserFindManyArgs) {
  return prisma.user.findMany(data);
}

export async function updateUser(data: Prisma.UserUpdateArgs) {
  return prisma.user.update(data);
}

export async function deleteUser(data: Prisma.UserDeleteArgs) {
  return prisma.user.delete(data);
}

export async function getUsersCount(data: Prisma.UserCountArgs) {
  return prisma.user.count(data);
}
