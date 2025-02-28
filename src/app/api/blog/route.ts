import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import getPaginationParams from "../helpers/getPaginationParams";
import { getSearchQuery } from "../helpers/getSearchQuery";
import handleError from "../helpers/handleError";
import { createBlog } from "./blog.controller";
import { BlogQuerySchema, BlogSchema } from "./blog.schema";

/**
 * @route POST /api/blog
 * @desc Create a new blog
 * @access Public
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = request.nextUrl.searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const validatedData = BlogSchema.parse(body);

    const blog = await createBlog({
      data: {
        Author: { connect: { id: userId } },
        ...validatedData,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return handleError(error, "Failed to create blog post");
  }
}

/**
 * @route GET /api/blog
 * @desc Fetch paginated list of blogs
 * @access Public
 */
export async function GET(request: NextRequest) {
  try {
    const PaginationSchema = BlogQuerySchema.omit({ search: true });
    const SearchSchema = BlogQuerySchema.pick({ search: true });

    const { page, size } = getPaginationParams({
      request,
      schema: PaginationSchema,
    });

    const { search: searchText } = getSearchQuery({
      request,
      schema: SearchSchema,
    });

    const searchFilter: Prisma.BlogWhereInput = searchText
      ? {
          OR: [
            { title: { contains: searchText, mode: "insensitive" as const } },
            { content: { contains: searchText, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [blogs, count] = await prisma.$transaction([
      prisma.blog.findMany({
        where: { ...searchFilter },
        include: {
          Author: {
            omit: { password: true, createdAt: true, updatedAt: true },
          },
        },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.blog.count({ where: { ...searchFilter } }),
    ]);

    return NextResponse.json(
      {
        items: blogs,
        count,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "Failed to fetch blog posts");
  }
}
