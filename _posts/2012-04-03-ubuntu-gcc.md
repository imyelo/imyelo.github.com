---
layout: post
type: post
title: 'Ubuntu11.10安装配置gcc'
category: Linux
tags:
- gcc
- linux
- ubuntu
published: true
---

## 下载
GCC下载：[http://gcc.gnu.org/releases.html](http://gcc.gnu.org/releases.html)  
可能还需要:GMP、GPFR、MPC：[ftp://gcc.gnu.org/pub/gcc/infrastructure/](ftp://gcc.gnu.org/pub/gcc/infrastructure/)  
M4:在Ubuntu软件中心下载  

## 参考文章
- [http://www.cnblogs.com/chuncn/archive/2010/10/15/1851853.html](http://www.cnblogs.com/chuncn/archive/2010/10/15/1851853.html)
- [**http://blog.csdn.net/kxcc_sx/article/details/5990462**](http://blog.csdn.net/kxcc_sx/article/details/5990462)
- [http://kb.cnblogs.com/a/2283013](http://kb.cnblogs.com/a/2283013/)
- [http://www.cnblogs.com/li_shugan/archive/2012/02/06/2337422.html](http://www.cnblogs.com/li_shugan/archive/2012/02/06/2337422.html)

## 修改后的脚本  
以下的脚本是在[第四个参考文章](http://www.cnblogs.com/li_shugan/archive/2012/02/06/2337422.html)的基础上做了修改.  

    #!/bin/sh

    #     Filename: build_gcc-snapshot.sh
    #      Created: 15-Mar-2011
    #        RunAs: user or root
    # Last Changed: 09-Oct-2011

    export LANG=C
    export LC_ALL=C

    PKG_NAME="gcc"
    PKG_VER="4.7.0"
    PKG_SNAPSHOT_VER="4.7.0"

    BASE_DIR="$HOME/src/${PKG_NAME}-${PKG_VER}"
    SRC_DIR="${BASE_DIR}/${PKG_NAME}-${PKG_SNAPSHOT_VER}"
    BUILD_DIR="${BASE_DIR}/gcc-build"

    DL_DIR="${BASE_DIR}/files"
    DL_FILE="${PKG_NAME}-${PKG_SNAPSHOT_VER}.tar.gz"

    PATCHES_DIR="${BASE_DIR}/patches"

    BUILD_SYSTEM_TYPE=$(dpkg-architecture -qDEB_BUILD_GNU_TYPE)
    HOST_SYSTEM_TYPE=$(dpkg-architecture -qDEB_HOST_GNU_TYPE)
    TARGET_SYSTEM_TYPE="x86_64-linux-gnu"

    HOST_SYSTEM_MULTIARCH_TYPE=$(dpkg-architecture -qDEB_HOST_MULTIARCH)

    PREFIX="/opt/${PKG_NAME}-${PKG_VER}"

    LIB_DIR="${PREFIX}/lib"
    LIB_EXEC_DIR="${PREFIX}/lib"

    BUILD_LOG_FILE="${BASE_DIR}/make.log"

    GCC_VER_FOR_BUILD="4.6"
    CC_FOR_BUILD="gcc-${GCC_VER_FOR_BUILD}"
    CXX_FOR_BUILD="g++-${GCC_VER_FOR_BUILD}"
    CPP_FOR_BUILD="cpp-${GCC_VER_FOR_BUILD}"
    export CC="${CC_FOR_BUILD}" CXX="${CXX_FOR_BUILD}" CPP="${CPP_FOR_BUILD}"
    echo "##### CC  ... $CC"
    echo "##### CXX ... $CXX"
    echo "##### CPP ... $CPP"

    MULTIARCH_FLAGS="-B/usr/lib/${HOST_SYSTEM_MULTIARCH_TYPE} -I/usr/include/${HOST_SYSTEM_MULTIARCH_TYPE}"

    export CFLAGS="-g -O2"
    export CXXFLAGS="${CFLAGS}"
    export CFLAGS_FOR_TARGET="${CFLAGS} ${MULTIARCH_FLAGS}"
    export CXXFLAGS_FOR_TARGET="${CXXFLAGS} ${MULTIARCH_FLAGS}"

    ##LD_PRELOAD_FOR_BUILD="${PREFIX}/lib/libgcc_s.so.1"
    ##export LD_PRELOAD=${LD_PRELOAD_FOR_BUILD}

    MAKE_JOBS="3"
    echo "##### MAKE_JOBS ... ${MAKE_JOBS}"

    test -e ${BASE_DIR} || mkdir -p ${BASE_DIR}
    echo "##### Base directory ... ${BASE_DIR}"

    echo "##### Unpacking ${DL_FILE} ..."
    tar -xf ${DL_DIR}/${DL_FILE} -C ${BASE_DIR}
    echo "##### Finished unpacking."

    test -e ${BUILD_DIR} || mkdir -p ${BUILD_DIR}
    cd ${BUILD_DIR}
    echo "##### Build directory ... $PWD"

    # HELP: http://www.linuxfromscratch.org/lfs/view/development/chapter06/gcc.html
    # NOTE: apt-get install libgmp10-dev libmpfr-dev libmpc-dev
    echo "##### Configuring gcc-build ..."
    ../${PKG_NAME}-${PKG_SNAPSHOT_VER}/configure \
        --prefix=${PREFIX} \
        --libdir=${LIB_DIR} \
        --libexecdir=${LIB_EXEC_DIR} \
        --program-suffix=-${PKG_VER} \
        --enable-clocale=gnu \
        --enable-languages=c,c++ \
        --enable-shared \
        --enable-threads=posix \
        --disable-bootstrap \
        --disable-libssp \
        --disable-multilib \
        --disable-nls \
        --with-system-zlib \
        --with-gmp=/usr/local/gmp-4.3.2 \
        --with-mpfr=/usr/local/mpfr-2.4.2 \
        --with-mpc=/usr/local/mpc-0.8.1 \
        --without-cloog \
        --without-ppl \
        --with-arch-32=i586 --with-tune=generic \
        --build=${BUILD_SYSTEM_TYPE} --host=${HOST_SYSTEM_TYPE} --target=${TARGET_SYSTEM_TYPE}
    echo "##### Finished configuring."

    echo "##### Compiling gcc-build ..."
    make FLAGS_FOR_TARGET="${FLAGS_FOR_TARGET} ${MULTIARCH_FLAGS}" -j${MAKE_JOBS} 2>&1 | tee ${BUILD_LOG_FILE}
    echo "##### Finished compiling."

    echo "NOTE #1: Before installing your shiny new gcc run the gcc-testsuite to check your build is OK!"

    echo "NOTE #2: Don't forget to generate symlinks in system's bin directory!"
    echo "EXAMPLE: sudo ln -sf ${PREFIX}/bin/${PKG_NAME}-${PKG_VER} /usr/bin/${PKG_NAME}-${PKG_VER}"

    echo "NOTE #3: Don't forget to add ${PREFIX}/lib' to /etc/ld.so.conf.d/${TARGET_SYSTEM_TYPE}.conf!"
    echo "EXAMPLE: sudo ldconfig -v"
