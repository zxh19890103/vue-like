export interface Tree {
    tag: string
    type: 1 | 2 | 3
    props: { [key: string]: string }
    children: Tree[]
}

export type TreeChild = Tree | string