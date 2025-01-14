import type {
  QueryResolvers,
  MutationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

/**
 * Lấy tất cả Task
 */
export const tasks: QueryResolvers['tasks'] = () => {
  return db.task.findMany()
}

/**
 * Lấy chi tiết Task theo ID
 */
export const task: QueryResolvers['task'] = ({ id }) => {
  return db.task.findUnique({
    where: { id },
  })
}

/**
 * Tạo Task mới
 */
export const createTask: MutationResolvers['createTask'] = ({ input }) => {
  return db.task.create({
    data: {
      name: input.name,
      config: input.config,  // Lưu JSON dạng String
    },
  })
}

/**
 * Cập nhật Task
 */
export const updateTask: MutationResolvers['updateTask'] = ({ id, input }) => {
  return db.task.update({
    where: { id },
    data: {
      name: input.name,
      config: input.config,
    },
  })
}

/**
 * Xóa Task
 */
export const deleteTask: MutationResolvers['deleteTask'] = ({ id }) => {
  return db.task.delete({
    where: { id },
  })
}
