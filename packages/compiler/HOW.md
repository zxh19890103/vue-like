## XML书写规范
1. 出现<，表示一个标签的开始或者结束，如果是标签开始，则<后必须是[AZaz]+，标签名必须与<在同一行出现，否则视为错误
2. 出现/>，表示标签已经自关闭
3. 出现</，表示标签要关闭，需要继续解析，直到发现>，这其间的字符必须是[AZaz]+，
4. 标签名的终止判断方式为，出现换行符、制表符、空格符
5. https://en.wikipedia.org/wiki/Well-formed_element
6. <后边必须为[AZaz]+, 或者 /

## Renderer
